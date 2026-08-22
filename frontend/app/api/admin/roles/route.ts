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
        `api/v1/admin/roles?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`,
      ),
      {
        cache: "no-store",
        headers: backendHeaders(request),
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch roles" },
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

export async function PATCH(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    if (
      !body ||
      typeof body !== "object" ||
      !("roleId" in body) ||
      typeof body.roleId !== "string" ||
      !("permissions" in body) ||
      !Array.isArray(body.permissions) ||
      !body.permissions.every((permission) => typeof permission === "string")
    ) {
      return NextResponse.json({ error: "Invalid role permissions" }, { status: 400 });
    }
    const { roleId, permissions } = body;
    const backendRes = await fetch(
      authServiceUrl(`api/v1/admin/roles/${encodeURIComponent(roleId)}/permissions`),
      {
        method: "PATCH",
        headers: { ...backendHeaders(request), "content-type": "application/json" },
        body: JSON.stringify({ permissions }),
      },
    );
    return NextResponse.json(await backendRes.json(), { status: backendRes.status });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
