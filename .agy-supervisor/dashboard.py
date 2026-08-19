#!/usr/bin/env python
"""Local AGY Kanban: stdlib-only, reads Git worktrees, processes, NDJSON logs."""
from __future__ import annotations

import argparse
import html
import json
import re
import subprocess
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import parse_qs, urlparse

ROOT = Path(__file__).resolve().parents[1]
WORKSPACE = ROOT.parent
HOST, PORT = "127.0.0.1", 8799
SECRET = re.compile(r"(?i)(password|secret|token|api[_-]?key)([\"'=:\s]+)([^\s,\"'}]+)")
LANE_NAME = {
    "agy01": "Knowledge schema",
    "agy02": "Expert schema",
    "k-domain": "Publication query",
    "k-http": "Publication public guard",
    "k-seed": "Publication seed",
    "e-domain": "Expert query",
    "e-http": "Expert matching",
    "e-seed": "Expert seed",
    "int": "Integration",
}


def run(*args: str) -> str:
    return subprocess.run(args, cwd=ROOT, text=True, capture_output=True, check=False).stdout


def redact(value: str) -> str:
    return SECRET.sub(r"\1\2[REDACTED]", value)[:1200]


def processes() -> str:
    if subprocess.os.name == "nt":
        return run("wmic", "process", "get", "ProcessId,CommandLine", "/format:csv")
    return run("ps", "-eo", "pid,args")


def worktrees() -> list[tuple[Path, str, str]]:
    raw = run("git", "worktree", "list", "--porcelain")
    rows, current = [], {}
    for line in raw.splitlines() + [""]:
        if not line:
            if current.get("worktree") and "vnru-m2-" in current["worktree"]:
                rows.append((Path(current["worktree"]), current.get("branch", "").removeprefix("refs/heads/"), current.get("HEAD", "")[:7]))
            current = {}
        elif " " in line:
            key, value = line.split(" ", 1)
            current[key] = value
    return rows


def latest_log(path: Path, key: str) -> tuple[str, list[str]]:
    logs = [*path.glob(".agy*.ndjson"), *(ROOT / ".agy-supervisor" / "logs").glob(f"*{key}*.ndjson")]
    logs.sort(key=lambda p: p.stat().st_mtime, reverse=True)
    if not logs:
        return "", []
    lines = logs[0].read_text(encoding="utf-8", errors="replace").splitlines()[-120:]
    events, raw, outcome = [], [], ""
    for line in lines:
        try:
            item = json.loads(line)
            if item.get("event") == "result":
                result = item.get("result", {})
                outcome = result.get("status", "")
                text = result.get("response") or result.get("error") or outcome
            elif item.get("event") == "step_update":
                step = item.get("step_update", {})
                if step.get("state") not in {"DONE", "ACTIVE"}:
                    continue
                text = step.get("text_delta") or step.get("tool_name") or step.get("step_type")
            else:
                continue
            if text:
                events.append(redact(" ".join(str(text).split())))
        except (json.JSONDecodeError, TypeError):
            text = redact(" ".join(line.split()))
            if text:
                raw.append(text)
    if not events and raw:
        return "INTERRUPTED", raw[-8:]
    return outcome, events[-8:]


def git_events(path: Path) -> list[str]:
    subject = run("git", "-C", str(path), "log", "-1", "--format=%h %s").strip()
    files = run("git", "-C", str(path), "show", "--name-only", "--format=", "HEAD").splitlines()
    return [f"commit {subject}", *[f"file {name}" for name in files if name]][:8]


def lane_state(path: Path, proc_text: str) -> dict:
    key = path.name.removeprefix("vnru-m2-")
    branch = run("git", "-C", str(path), "branch", "--show-current").strip()
    sha = run("git", "-C", str(path), "rev-parse", "--short", "HEAD").strip()
    dirty_lines = [x for x in run("git", "-C", str(path), "status", "--short").splitlines() if ".agy" not in x]
    outcome, events = latest_log(path, key)
    running = "agy" in proc_text.lower() and str(path).lower().replace("/", "\\") in proc_text.lower().replace("/", "\\")
    committed = sha != "acd84a3" and not dirty_lines
    if not events:
        events = git_events(path)
    if key == "int":
        column, status = "review", "INTEGRATING"
    elif running:
        column, status = "running", "RUNNING"
    elif outcome == "ERROR":
        column, status = "blocked", "BLOCKED"
    elif dirty_lines:
        column, status = "review", "REVIEW"
    elif committed:
        column, status = "done", "DONE"
    elif outcome:
        column, status = "review", outcome
    else:
        column, status = "planned", "PLANNED"
    return {
        "id": key,
        "name": LANE_NAME.get(key, key.replace("-", " ").title()),
        "branch": branch,
        "sha": sha,
        "status": status,
        "column": column,
        "dirty": dirty_lines[:8],
        "events": events,
    }


def board() -> dict:
    proc_text = processes()
    lanes = [lane_state(path, proc_text) for path, _, _ in worktrees()]
    order = {"running": 0, "blocked": 1, "review": 2, "planned": 3, "done": 4}
    lanes.sort(key=lambda x: (order[x["column"]], x["name"]))
    return {"updatedAt": time.strftime("%Y-%m-%d %H:%M:%S"), "lanes": lanes}


PAGE = r'''<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>AGY Runtime Board</title><style>
:root{color-scheme:dark;--bg:#0b0d0f;--panel:#12161a;--line:#29313a;--ink:#e8edf2;--muted:#84909c;--run:#e9ff70;--done:#65e6a8;--bad:#ff6b6b;--review:#72b7ff}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:14px ui-monospace,SFMono-Regular,Consolas,monospace}header{position:sticky;top:0;z-index:2;display:flex;justify-content:space-between;align-items:end;padding:24px 28px;border-bottom:1px solid var(--line);background:#0b0d0feb}h1{font-size:22px;margin:0;letter-spacing:-1px}.meta{color:var(--muted)}main{display:grid;grid-template-columns:repeat(5,minmax(230px,1fr));gap:12px;padding:16px;overflow-x:auto;min-height:calc(100vh - 78px)}section{min-width:230px}.head{display:flex;justify-content:space-between;padding:10px 4px;color:var(--muted);text-transform:uppercase;letter-spacing:.12em}.count{border:1px solid var(--line);border-radius:99px;padding:1px 7px}.card{background:var(--panel);border:1px solid var(--line);border-left:3px solid var(--muted);padding:14px;margin-bottom:10px}.card.running{border-left-color:var(--run)}.card.done{border-left-color:var(--done)}.card.blocked{border-left-color:var(--bad)}.card.review{border-left-color:var(--review)}.title{font-weight:700;margin-bottom:9px}.tag{display:inline-block;padding:2px 6px;border:1px solid var(--line);font-size:11px;color:var(--muted)}.sha{float:right;color:var(--muted)}details{margin-top:11px}summary{cursor:pointer;color:var(--muted)}pre{white-space:pre-wrap;overflow-wrap:anywhere;background:#090b0d;border:1px solid var(--line);padding:9px;max-height:220px;overflow:auto;font-size:11px}.empty{color:#48525c;padding:12px 4px}@media(max-width:800px){header{padding:16px}main{padding:10px}}
</style></head><body><header><div><h1>AGY / RUNTIME BOARD</h1><div class="meta">Git worktrees · OS processes · NDJSON</div></div><div id="updated" class="meta">loading</div></header><main id="board"></main><script>
const columns=[['planned','Planned'],['running','Running'],['review','Review'],['blocked','Blocked'],['done','Done']];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function card(x){const log=[...(x.dirty||[]).map(v=>'Δ '+v),...(x.events||[])].join('\n');return `<article class="card ${x.column}"><div class="title">${esc(x.name)}<span class="sha">${esc(x.sha)}</span></div><span class="tag">${esc(x.status)}</span><div class="meta" style="margin-top:8px">${esc(x.branch)}</div><details><summary>runtime / log</summary><pre>${esc(log||'No log')}</pre></details></article>`}
async function refresh(){try{const d=await fetch('/api/board',{cache:'no-store'}).then(r=>r.json());document.querySelector('#updated').textContent=d.updatedAt;document.querySelector('#board').innerHTML=columns.map(([id,label])=>{const xs=d.lanes.filter(x=>x.column===id);return `<section><div class="head"><span>${label}</span><span class="count">${xs.length}</span></div>${xs.map(card).join('')||'<div class="empty">—</div>'}</section>`}).join('')}catch(e){document.querySelector('#updated').textContent='offline'}}refresh();setInterval(refresh,3000);
</script></body></html>'''


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        route = urlparse(self.path).path
        if route == "/api/board":
            body, mime, status = json.dumps(board(), ensure_ascii=False).encode(), "application/json; charset=utf-8", 200
        elif route == "/":
            body, mime, status = PAGE.encode(), "text/html; charset=utf-8", 200
        elif route == "/favicon.ico":
            body, mime, status = b"", "image/x-icon", 204
        else:
            self.send_error(404)
            return
        self.send_response(status)
        self.send_header("Content-Type", mime)
        self.send_header("Cache-Control", "no-store")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, *_):
        pass


def self_check() -> None:
    assert redact('token="abc"') == 'token="[REDACTED]"'
    data = board()
    assert isinstance(data["lanes"], list)
    assert all(x["column"] in {"planned", "running", "review", "blocked", "done"} for x in data["lanes"])
    print(f"PASS lanes={len(data['lanes'])}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--check", action="store_true")
    parser.add_argument("--port", type=int, default=PORT)
    args = parser.parse_args()
    if args.check:
        self_check()
    else:
        print(f"AGY board: http://{HOST}:{args.port}")
        ThreadingHTTPServer((HOST, args.port), Handler).serve_forever()
