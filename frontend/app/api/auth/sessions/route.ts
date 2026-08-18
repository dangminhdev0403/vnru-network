import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  backendHeaders,
} from "../../../../features/auth/server";

export async function GET(request: NextRequest) {
  try {
    const backendRes = await fetch(authServiceUrl("api/v1/auth/sessions"), {
      cache: "no-store",
      headers: backendHeaders(request),
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch active sessions" },
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

export async function DELETE(request: NextRequest) {
  try {
    const backendRes = await fetch(authServiceUrl("api/v1/auth/sessions"), {
      method: "DELETE",
      cache: "no-store",
      headers: backendHeaders(request),
    });

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to revoke other sessions" },
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
