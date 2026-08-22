import { NextRequest, NextResponse } from "next/server";
import {
  collabServiceUrl,
  backendHeaders,
} from "@/features/auth/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const backendRes = await fetch(
      collabServiceUrl(`api/v1/collab/proposals/${encodeURIComponent(id)}`),
      {
        cache: "no-store",
        headers: backendHeaders(request),
      },
    );

    if (!backendRes.ok) {
      return NextResponse.json(
        { error: "Proposal not found" },
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

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body: unknown = await request.json();
    const headers = backendHeaders(request);
    headers.set("content-type", "application/json");

    const backendRes = await fetch(
      collabServiceUrl(`api/v1/collab/proposals/${encodeURIComponent(id)}`),
      {
        method: "PUT",
        headers,
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(await backendRes.json(), { status: backendRes.status });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
