import { NextRequest, NextResponse } from "next/server";

// PUT handler
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();

  // Your booking update logic here

  return NextResponse.json({ message: `Booking ${id} updated successfully` });
}

// GET handler
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  return NextResponse.json({ message: `Booking ${id} fetched successfully` });
}
