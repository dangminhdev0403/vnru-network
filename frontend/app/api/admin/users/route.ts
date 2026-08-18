import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  backendHeaders,
} from "../../../../features/auth/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") || "10";
    const offset = url.searchParams.get("offset") || "0";

    const backendRes = await fetch(
      authServiceUrl(
        `api/v1/admin/users?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
      ),
      {
        cache: "no-store",
        headers: backendHeaders(request),
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch users" },
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
