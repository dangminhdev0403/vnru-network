import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  backendHeaders,
} from "../../../../features/auth/server";

async function proxy(request: NextRequest, method: "GET" | "PATCH") {
  const headers = backendHeaders(request);
  if (method === "PATCH") headers.set("content-type", "application/json");
  const backend = await fetch(authServiceUrl("api/v1/auth/profile"), {
    method,
    cache: "no-store",
    headers,
    body: method === "PATCH" ? await request.text() : undefined,
  });
  return new NextResponse(backend.body, {
    status: backend.status,
    headers: {
      "content-type": backend.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = (request: NextRequest) => proxy(request, "GET");
export const PATCH = (request: NextRequest) => proxy(request, "PATCH");
