import { NextRequest, NextResponse } from "next/server";
import { authServiceUrl } from "../../../../features/auth/server";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || !URL.canParse(origin) || new URL(origin).origin !== request.nextUrl.origin) return NextResponse.json({ error: "Invalid registration origin" }, { status: 403 });
  const response = await fetch(authServiceUrl("api/v1/auth/register"), { method: "POST", headers: { "content-type": "application/json" }, body: await request.text(), cache: "no-store" }).catch(() => null);
  if (!response) return NextResponse.json({ error: "Registration unavailable" }, { status: 503 });
  return NextResponse.json(await response.json().catch(() => ({})), { status: response.status });
}
