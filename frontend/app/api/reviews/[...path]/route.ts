import { NextRequest, NextResponse } from "next/server";
import { reviewServiceUrl, backendHeaders } from "@/features/auth/server";

async function proxy(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  try {
    const { path } = await params;
    const url = new URL(request.url);
    const targetUrl = new URL(reviewServiceUrl(`api/v1/reviews/${path.map(encodeURIComponent).join("/")}`));
    targetUrl.search = url.search;

    const headers = backendHeaders(request);
    if (request.headers.get("content-type")) {
      headers.set("content-type", request.headers.get("content-type")!);
    }

    const init: RequestInit = { method: request.method, headers };

    if (request.method !== "GET" && request.method !== "HEAD") {
      const text = await request.text();
      if (text) init.body = text;
    } else {
      init.cache = "no-store";
    }

    const backendRes = await fetch(targetUrl.toString(), init);

    const resText = await backendRes.text();
    let data: unknown = resText;
    try { if (resText) data = JSON.parse(resText); } catch {}

    return NextResponse.json(data, { status: backendRes.status });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
