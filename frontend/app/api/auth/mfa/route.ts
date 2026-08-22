import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  backendHeaders,
} from "../../../../features/auth/server";

async function proxy(request: NextRequest, method: "GET" | "DELETE") {
  const backend = await fetch(authServiceUrl("api/v1/auth/mfa"), {
    method,
    cache: "no-store",
    headers: backendHeaders(request),
  });
  return new NextResponse(backend.body, {
    status: backend.status,
    headers: {
      "content-type": backend.headers.get("content-type") ?? "application/json",
    },
  });
}

export const GET = (request: NextRequest) => proxy(request, "GET");
export const DELETE = (request: NextRequest) => proxy(request, "DELETE");
