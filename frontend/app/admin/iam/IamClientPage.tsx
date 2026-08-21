"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { showError, showToast } from "@/lib/alerts";

type View = "overview" | "roles" | "assignments";
type User = { id: string; email: string | null; status: "ACTIVE" | "INACTIVE" };
type Role = { id: string; name: string; permissions: string[] };

const views: Array<{ id: View; label: string; icon: string }> = [
  { id: "overview", label: "Tổng quan", icon: "space_dashboard" },
  { id: "roles", label: "Vai trò & Quyền hạn", icon: "admin_panel_settings" },
  { id: "assignments", label: "Gán vai trò", icon: "assignment_ind" },
];

export default function IamClientPage({ initialView = "overview" }: Readonly<{ initialView?: View }>) {
  const router = useRouter();
  const [view, setView] = useState<View>(initialView);
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [assignRoleId, setAssignRoleId] = useState("");
  const [contextType, setContextType] = useState("");
  const [contextId, setContextId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [statusTarget, setStatusTarget] = useState<User | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAuthFailure = useCallback((status: number) => {
    if (status === 401) {
      router.push("/api/auth/login?returnTo=/admin/iam");
      return true;
    }
    if (status === 403) {
      setAccessDenied(true);
      return true;
    }
    return false;
  }, [router]);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const [usersResponse, rolesResponse] = await Promise.all([
          fetch("/api/admin/users?limit=100&offset=0"),
          fetch("/api/admin/roles?limit=100&offset=0"),
        ]);
        if (handleAuthFailure(usersResponse.status) || handleAuthFailure(rolesResponse.status)) return;
        if (!usersResponse.ok || !rolesResponse.ok) throw new Error("Không thể tải dữ liệu IAM.");
        const [nextUsers, nextRoles] = await Promise.all([usersResponse.json(), rolesResponse.json()]) as [User[], Role[]];
        if (!active) return;
        setUsers(nextUsers);
        setRoles(nextRoles);
        setSelectedRoleId((current) => current || nextRoles[0]?.id || "");
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : "Không thể tải dữ liệu IAM.");
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [handleAuthFailure, refreshKey]);

  const selectedRole = useMemo(() => roles.find((role) => role.id === selectedRoleId) ?? roles[0], [roles, selectedRoleId]);
  const activeUsers = users.filter((user) => user.status === "ACTIVE").length;
  const permissionCount = new Set(roles.flatMap((role) => role.permissions ?? [])).size;

  const changeView = (next: View) => {
    setView(next);
    router.replace(`/admin/iam?view=${next}`, { scroll: false });
  };

  const updateUserStatus = async () => {
    if (!statusTarget) return;
    setSubmitting(true);
    const status = statusTarget.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      const response = await fetch(`/api/admin/users/${statusTarget.id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (handleAuthFailure(response.status)) return;
      if (!response.ok) throw new Error("Không thể cập nhật trạng thái người dùng.");
      setStatusTarget(null);
      setRefreshKey((key) => key + 1);
      showToast({ title: "Đã cập nhật trạng thái người dùng", icon: "success" });
    } catch (cause) {
      showError("Cập nhật thất bại", cause instanceof Error ? cause.message : "Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  const assignRole = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!assignUserId || !assignRoleId) {
      showError("Thiếu thông tin", "Chọn người dùng và vai trò.");
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/admin/role-assignments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: assignUserId,
          roleId: assignRoleId,
          contextType: contextType.trim() || undefined,
          contextId: contextId.trim() || undefined,
          status: "ACTIVE",
        }),
      });
      if (handleAuthFailure(response.status)) return;
      if (!response.ok) throw new Error("Không thể gán vai trò.");
      setAssignUserId("");
      setAssignRoleId("");
      setContextType("");
      setContextId("");
      showToast({ title: "Đã gán vai trò", icon: "success" });
    } catch (cause) {
      showError("Gán vai trò thất bại", cause instanceof Error ? cause.message : "Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  };

  if (accessDenied) {
    return <main className="grid min-h-screen place-items-center bg-[#f5f7fb] p-6"><section className="w-full max-w-md rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-xl"><span className="material-symbols-outlined text-4xl text-amber-700">shield_person</span><h1 className="mt-4 text-2xl font-bold">Không có quyền truy cập</h1><p className="mt-2 text-sm text-slate-600">Backend từ chối quyền quản trị IAM trong ngữ cảnh hiện tại.</p><Link href="/workspace/iam" className="mt-6 inline-flex rounded-xl bg-[#10203b] px-4 py-2.5 text-sm font-bold text-white">Về Module 01</Link></section></main>;
  }

  return (
    <div className="min-h-screen bg-[#f5f7fb] text-[#152033] lg:grid lg:grid-cols-[246px_minmax(0,1fr)]">
      <aside className="bg-[#10203b] px-4 py-6 text-white lg:sticky lg:top-0 lg:h-screen">
        <Link href="/" className="flex items-center gap-3 px-2"><span className="grid h-10 w-10 place-items-center rounded-xl bg-white font-black text-[#10203b]">VR</span><span><strong className="block text-sm">Science-Technology Network</strong><small className="text-slate-400">Định danh & Phân quyền</small></span></Link>
        <nav className="mt-8 grid grid-cols-2 gap-1 lg:grid-cols-1" aria-label="Điều hướng quản trị IAM">
          {views.map((item) => <button key={item.id} type="button" onClick={() => changeView(item.id)} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-semibold ${view === item.id ? "bg-[#24456f] text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"}`}><span className="material-symbols-outlined text-xl">{item.icon}</span>{item.label}</button>)}
          <Link href="/security" className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-300 hover:bg-white/5 hover:text-white"><span className="material-symbols-outlined text-xl">policy</span>Nhật ký & Bảo mật</Link>
        </nav>
        <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4 lg:mt-auto"><span className="flex items-center gap-2 text-xs font-bold"><i className="h-2 w-2 rounded-full bg-emerald-400" />Backend authorization active</span><small className="mt-2 block text-white/70">UI không lưu role, permission hoặc audit giả trong trình duyệt.</small></div>
      </aside>

      <main className="min-w-0 p-4 sm:p-6 lg:p-8">
        <header className="mb-6 flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs text-slate-500">Quản trị hệ thống / Module 01</p><h1 className="mt-2 text-3xl font-bold tracking-tight">{views.find((item) => item.id === view)?.label}</h1><p className="mt-2 text-sm text-slate-600">Identity → Context → Role → Backend decision.</p></div><div className="flex gap-2"><Link href="/workspace/iam" className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold">Workspace</Link><button type="button" onClick={() => setRefreshKey((key) => key + 1)} className="rounded-xl bg-[#2457d6] px-4 py-2.5 text-sm font-bold text-white">Làm mới</button></div></header>

        {error ? <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</div> : null}

        {view === "overview" ? <>
          <section className="grid gap-4 sm:grid-cols-3">{[["group", activeUsers, "Người dùng hoạt động"], ["admin_panel_settings", roles.length, "Vai trò hệ thống"], ["key", permissionCount, "Quyền hạn hiện có"]].map(([icon, value, label]) => <article key={String(label)} className="rounded-2xl border border-[#e5eaf0] bg-white p-5 shadow-[0_8px_28px_rgba(16,32,59,.07)]"><span className="material-symbols-outlined text-[#2457d6]">{icon}</span><strong className="mt-3 block text-3xl">{loading ? "—" : value}</strong><span className="text-sm text-slate-500">{label}</span></article>)}</section>
          <section className="mt-4 overflow-hidden rounded-2xl border border-[#e5eaf0] bg-white shadow-[0_8px_28px_rgba(16,32,59,.07)]"><div className="border-b border-slate-200 p-5"><h2 className="font-bold">Danh tính nền tảng</h2><p className="mt-1 text-xs text-slate-500">Dữ liệu thật từ auth-service; thay đổi trạng thái được backend kiểm tra và audit.</p></div><div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-xs text-slate-500"><tr><th className="p-4">Email</th><th className="p-4">Trạng thái</th><th className="p-4 text-right">Hành động</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className="border-t border-slate-100"><td className="p-4"><strong>{user.email || "Chưa có email"}</strong><small className="block font-mono text-slate-400">{user.id}</small></td><td className="p-4"><span className={`rounded-full border px-2.5 py-1 text-xs font-bold ${user.status === "ACTIVE" ? "border-emerald-200 text-emerald-700" : "border-slate-200 text-slate-600"}`}>{user.status === "ACTIVE" ? "Đang hoạt động" : "Đã khóa"}</span></td><td className="p-4 text-right"><button type="button" onClick={() => setStatusTarget(user)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold">{user.status === "ACTIVE" ? "Khóa" : "Kích hoạt"}</button></td></tr>)}</tbody></table></div></section>
        </> : null}

        {view === "roles" ? <section className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]"><div className="rounded-2xl border border-[#e5eaf0] bg-white p-3 shadow-[0_8px_28px_rgba(16,32,59,.07)]"><h2 className="p-3 font-bold">Danh mục vai trò</h2>{roles.map((role) => <button key={role.id} type="button" onClick={() => setSelectedRoleId(role.id)} className={`mb-1 w-full rounded-xl p-3 text-left text-sm font-bold ${selectedRole?.id === role.id ? "bg-[#eef3ff] text-[#2457d6]" : "hover:bg-slate-50"}`}>{role.name}<small className="mt-1 block font-mono font-normal text-slate-400">{role.permissions?.length || 0} quyền</small></button>)}</div><div className="rounded-2xl border border-[#e5eaf0] bg-white p-6 shadow-[0_8px_28px_rgba(16,32,59,.07)]"><p className="text-xs font-bold uppercase tracking-wider text-[#2457d6]">Authoritative policy</p><h2 className="mt-2 text-xl font-bold">{selectedRole?.name || "Chọn vai trò"}</h2><p className="mt-1 font-mono text-xs text-slate-400">{selectedRole?.id}</p><div className="mt-6 grid gap-2 sm:grid-cols-2">{selectedRole?.permissions?.map((permission) => <code key={permission} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-700">{permission}</code>)}</div><p className="mt-6 text-xs text-slate-500">Read-only: backend hiện chưa cung cấp endpoint sửa permission của role.</p></div></section> : null}

        {view === "assignments" ? <section className="max-w-3xl rounded-2xl border border-[#e5eaf0] bg-white p-6 shadow-[0_8px_28px_rgba(16,32,59,.07)]"><h2 className="text-xl font-bold">Gán vai trò theo ngữ cảnh</h2><p className="mt-1 text-sm text-slate-500">Chọn danh tính và vai trò bằng nhãn người dùng; backend xác thực scope và quyền quản trị.</p><form onSubmit={assignRole} className="mt-6 grid gap-4 sm:grid-cols-2"><label className="grid gap-1.5 text-xs font-bold">Người dùng<select required value={assignUserId} onChange={(event) => setAssignUserId(event.target.value)} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal"><option value="">Chọn người dùng…</option>{users.map((user) => <option key={user.id} value={user.id}>{user.email || user.id}</option>)}</select></label><label className="grid gap-1.5 text-xs font-bold">Vai trò<select required value={assignRoleId} onChange={(event) => setAssignRoleId(event.target.value)} className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-normal"><option value="">Chọn vai trò…</option>{roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</select></label><label className="grid gap-1.5 text-xs font-bold">Loại ngữ cảnh <span className="font-normal text-slate-400">(tùy chọn)</span><input value={contextType} onChange={(event) => setContextType(event.target.value)} placeholder="ORGANIZATION" className="rounded-xl border border-slate-200 p-3 text-sm font-normal" /></label><label className="grid gap-1.5 text-xs font-bold">Mã ngữ cảnh <span className="font-normal text-slate-400">(tùy chọn)</span><input value={contextId} onChange={(event) => setContextId(event.target.value)} placeholder="Context ID" className="rounded-xl border border-slate-200 p-3 text-sm font-normal" /></label><button type="submit" disabled={submitting} className="rounded-xl bg-[#2457d6] px-5 py-3 text-sm font-bold text-white disabled:opacity-50 sm:col-span-2 sm:justify-self-end">{submitting ? "Đang xử lý…" : "Xác nhận gán vai trò"}</button></form></section> : null}
      </main>

      {statusTarget ? <div role="dialog" aria-modal="true" aria-labelledby="status-dialog-title" className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-4"><section className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"><h2 id="status-dialog-title" className="text-xl font-bold">{statusTarget.status === "ACTIVE" ? "Khóa tài khoản?" : "Kích hoạt tài khoản?"}</h2><p className="mt-2 text-sm text-slate-600">{statusTarget.email || statusTarget.id}</p><div className="mt-6 flex justify-end gap-2"><button type="button" disabled={submitting} onClick={() => setStatusTarget(null)} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold">Hủy</button><button type="button" disabled={submitting} onClick={updateUserStatus} className="rounded-xl bg-[#10203b] px-4 py-2 text-sm font-bold text-white">Xác nhận</button></div></section></div> : null}
    </div>
  );
}
