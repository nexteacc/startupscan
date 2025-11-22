import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  console.log("Test request received:", body);
  return NextResponse.json({ message: "Test successful" });
}
