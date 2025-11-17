import { NextRequest, NextResponse } from "next/server";

// GET single booking
export async function GET(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return NextResponse.json({ message: `Booking ${id} fetched successfully` });
}

// PUT update booking
export async function PUT(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = await request.json();
  return NextResponse.json({ message: `Booking ${id} updated successfully` });
}

// DELETE booking
export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  return NextResponse.json({ message: `Booking ${id} deleted successfully` });
}

