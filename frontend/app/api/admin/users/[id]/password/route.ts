import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  backendHeaders,
} from "../../../../../../features/auth/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();
    if (!id?.trim() || typeof body?.password !== "string") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }
    const backendRes = await fetch(
      authServiceUrl(
        `api/v1/admin/users/${encodeURIComponent(id.trim())}/password`,
      ),
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          ...Object.fromEntries(backendHeaders(request).entries()),
          "content-type": "application/json",
        },
        body: JSON.stringify({ password: body.password }),
      },
    );
    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to reset password" },
        { status: backendRes.status },
      );
    }
    return NextResponse.json(await backendRes.json());
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
