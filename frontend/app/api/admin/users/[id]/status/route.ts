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
    if (!id || !id.trim()) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 },
      );
    }

    const body = await request.json();
    if (!body || typeof body.status !== "string") {
      return NextResponse.json(
        { error: "Status must be a string" },
        { status: 400 },
      );
    }

    const backendRes = await fetch(
      authServiceUrl(
        `api/v1/admin/users/${encodeURIComponent(id.trim())}/status`,
      ),
      {
        method: "PATCH",
        cache: "no-store",
        headers: {
          ...Object.fromEntries(backendHeaders(request).entries()),
          "content-type": "application/json",
        },
        body: JSON.stringify({ status: body.status }),
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to update user status" },
        { status: backendRes.status },
      );
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
