import { NextRequest, NextResponse } from "next/server";
import {
  collabServiceUrl,
  backendHeaders,
} from "@/features/auth/server";

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const limit = url.searchParams.get("limit") || "20";
    const offset = url.searchParams.get("offset") || "0";

    const backendRes = await fetch(
      collabServiceUrl(`api/v1/collab/opportunities?limit=${encodeURIComponent(limit)}&offset=${encodeURIComponent(offset)}`),
      {
        cache: "no-store",
        headers: backendHeaders(request),
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch research opportunities" },
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

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const backendRes = await fetch(
      collabServiceUrl("api/v1/collab/opportunities"),
      {
        method: "POST",
        headers: { ...backendHeaders(request), "content-type": "application/json" },
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(await backendRes.json(), { status: backendRes.status });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
