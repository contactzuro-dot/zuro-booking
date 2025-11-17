import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { format, addMinutes, getDay, isBefore, isAfter } from 'date-fns';

export async function GET(request: NextRequest) {
  try {
    const supabase = createServerClient();
    const searchParams = request.nextUrl.searchParams;
    const dateStr = searchParams.get('date');
    const serviceId = searchParams.get('serviceId');

    if (!dateStr || !serviceId) {
      return NextResponse.json(
        { error: 'Date and serviceId are required' },
        { status: 400 }
      );
    }

    // Fetch service to get duration
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', serviceId)
      .single();

    if (serviceError || !service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }

    // Fetch business hours for the day
    const selectedDate = new Date(dateStr);
    const dayOfWeek = getDay(selectedDate);

    const { data: businessHours, error: hoursError } = await supabase
      .from('business_hours')
      .select('*')
      .eq('day_of_week', dayOfWeek)
      .single();

    if (hoursError || !businessHours || businessHours.is_closed) {
      return NextResponse.json({ timeSlots: [] });
    }

    // Fetch existing bookings for the date
    const { data: existingBookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('booking_time, service_id, status')
      .eq('booking_date', dateStr)
      .in('status', ['pending', 'confirmed']);

    if (bookingsError) {
      return NextResponse.json({ error: bookingsError.message }, { status: 500 });
    }

    // Generate time slots
    const timeSlots: Array<{ time: string; available: boolean }> = [];
    const [openHour, openMin] = businessHours.open_time.split(':').map(Number);
    const [closeHour, closeMin] = businessHours.close_time.split(':').map(Number);

    const openTime = new Date(selectedDate);
    openTime.setHours(openHour, openMin, 0, 0);

    const closeTime = new Date(selectedDate);
    closeTime.setHours(closeHour, closeMin, 0, 0);

    let currentTime = openTime;

    while (isBefore(addMinutes(currentTime, service.duration), closeTime) || 
           isBefore(addMinutes(currentTime, service.duration), addMinutes(closeTime, 1))) {
      const timeStr = format(currentTime, 'HH:mm');
      
      // Check if this time slot conflicts with existing bookings
      const isBooked = existingBookings?.some((booking) => {
        if (booking.service_id !== serviceId) return false;
        
        const bookingTimeStr = booking.booking_time;
        const [bookingHour, bookingMin] = bookingTimeStr.split(':').map(Number);
        const bookingTime = new Date(selectedDate);
        bookingTime.setHours(bookingHour, bookingMin, 0, 0);
        
        const bookingEnd = addMinutes(bookingTime, service.duration);
        const slotEnd = addMinutes(currentTime, service.duration);

        // Check for overlap
        return (
          (isBefore(currentTime, bookingEnd) && isAfter(currentTime, bookingTime)) ||
          (isBefore(bookingTime, slotEnd) && isAfter(bookingTime, currentTime)) ||
          (currentTime.getTime() === bookingTime.getTime())
        );
      });

      timeSlots.push({
        time: timeStr,
        available: !isBooked,
      });

      currentTime = addMinutes(currentTime, 30); // 30-minute intervals
    }

    return NextResponse.json({ timeSlots });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

