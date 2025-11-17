import { NextRequest, NextResponse } from "next/server";

// GET /api/bookings/[id]
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Promise
) {
  const { id } = await context.params; // ✅ await it
  return NextResponse.json({ message: `Booking ${id} fetched successfully` });
}

// PUT /api/bookings/[id]
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Promise
) {
  const { id } = await context.params;
  const body = await request.json();

  // Example: Update booking logic here
  return NextResponse.json({ message: `Booking ${id} updated successfully` });
}

// DELETE /api/bookings/[id]
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> } // ✅ Promise
) {
  const { id } = await context.params;

  // Example: Delete booking logic here
  return NextResponse.json({ message: `Booking ${id} deleted successfully` });
}
