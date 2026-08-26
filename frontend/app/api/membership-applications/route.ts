import { NextRequest, NextResponse } from "next/server";
import { authServiceUrl } from "../../../features/auth/server";

export async function POST(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin || !URL.canParse(origin) || new URL(origin).origin !== request.nextUrl.origin) {
    return NextResponse.json({ error: "Invalid request origin" }, { status: 403 });
  }

  try {
    const backend = await fetch(authServiceUrl("api/v1/membership-applications"), {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: await request.text(),
      cache: "no-store",
    });
    const data = await backend.json().catch(() => ({ error: "Registration service unavailable" }));
    return NextResponse.json(data, { status: backend.status });
  } catch {
    return NextResponse.json({ error: "Registration service unavailable" }, { status: 503 });
  }
}
