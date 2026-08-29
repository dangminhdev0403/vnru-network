import { NextRequest, NextResponse } from "next/server";
import { authServiceUrl, isSameOriginRequest } from "../../../../features/auth/server";

export async function POST(request: NextRequest) {
  if (!isSameOriginRequest(request)) return NextResponse.json({ error: "Invalid registration origin" }, { status: 403 });
  const response = await fetch(authServiceUrl("api/v1/auth/register"), { method: "POST", headers: { "content-type": "application/json" }, body: await request.text(), cache: "no-store" }).catch(() => null);
  if (!response) return NextResponse.json({ error: "Registration unavailable" }, { status: 503 });
  return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
}
