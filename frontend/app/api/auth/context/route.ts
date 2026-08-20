import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  backendHeaders,
  forwardSessionCookie,
} from "../../../../features/auth/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const backendRes = await fetch(authServiceUrl("api/v1/auth/context"), {
      method: "POST",
      cache: "no-store",
      headers: {
        ...Object.fromEntries(backendHeaders(request)),
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Context switch denied" },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    const response = NextResponse.json(data);
    forwardSessionCookie(backendRes, response.headers);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
