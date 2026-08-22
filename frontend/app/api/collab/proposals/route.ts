import { NextRequest, NextResponse } from "next/server";
import {
  collabServiceUrl,
  backendHeaders,
} from "@/features/auth/server";

export async function POST(request: NextRequest) {
  try {
    const body: unknown = await request.json();
    const headers = backendHeaders(request);
    headers.set("content-type", "application/json");

    const backendRes = await fetch(
      collabServiceUrl("api/v1/collab/proposals"),
      {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      },
    );
    return NextResponse.json(await backendRes.json(), { status: backendRes.status });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
