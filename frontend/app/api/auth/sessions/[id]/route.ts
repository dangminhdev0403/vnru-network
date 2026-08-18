import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  backendHeaders,
  forwardSessionCookie,
} from "../../../../../features/auth/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    if (!id || !id.trim()) {
      return NextResponse.json(
        { error: "Session ID is required" },
        { status: 400 },
      );
    }

    const backendRes = await fetch(
      authServiceUrl(`api/v1/auth/sessions/${encodeURIComponent(id.trim())}`),
      {
        method: "DELETE",
        cache: "no-store",
        headers: backendHeaders(request),
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to revoke session" },
        { status: backendRes.status },
      );
    }

    const response = NextResponse.json({ ok: true });
    forwardSessionCookie(backendRes, response.headers);
    return response;
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
