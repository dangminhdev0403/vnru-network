import { NextRequest, NextResponse } from "next/server";
import {
  authServiceUrl,
  backendHeaders,
} from "../../../../features/auth/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendRes = await fetch(
      authServiceUrl("api/v1/admin/role-assignments"),
      {
        method: "POST",
        cache: "no-store",
        headers: {
          ...Object.fromEntries(backendHeaders(request).entries()),
          "content-type": "application/json",
        },
        body: JSON.stringify(body),
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to create role assignment" },
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
