import { NextRequest, NextResponse } from "next/server";

// GET all bookings
export async function GET(request: NextRequest) {
  // Example: fetch all bookings from Supabase
  return NextResponse.json({ message: "All bookings fetched successfully" });
}

// POST new booking
export async function POST(request: NextRequest) {
  const body = await request.json();

  // Example: insert booking into Supabase
  return NextResponse.json({ message: "Booking created successfully", data: body });
}
