import { NextRequest, NextResponse } from "next/server";
import { authServiceUrl, backendHeaders } from "@/features/auth/server";

async function proxy(
  request: NextRequest,
  context: { params: Promise<{ path?: string[] }> },
) {
  const { path = [] } = await context.params;
  const target = authServiceUrl(
    `api/v1/admin/news${path.length ? `/${path.map(encodeURIComponent).join("/")}` : ""}${request.nextUrl.search}`,
  );
  const headers = backendHeaders(request);
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);
  const response = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === "GET" ? undefined : await request.arrayBuffer(),
    cache: "no-store",
  });
  const body = await response.arrayBuffer();
  return new NextResponse(body, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  });
}

export const GET = proxy;
export const POST = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
