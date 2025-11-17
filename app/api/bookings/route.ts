import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { stripe } from '@/lib/stripe';

const supabase = createServerClient();

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        service:services(*)
      `)
      .order('booking_date', { ascending: false })
      .order('booking_time', { ascending: false });

    if (error) throw error;

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      service_id,
      booking_date,
      booking_time,
      customer_name,
      customer_email,
      customer_phone,
    } = body;

    // Fetch service to calculate amounts
    const { data: service, error: serviceError } = await supabase
      .from('services')
      .select('*')
      .eq('id', service_id)
      .single();

    if (serviceError || !service) {
      throw new Error('Service not found');
    }

    const totalAmount = service.price;
    const depositAmount = Math.round((service.price * service.deposit_percent) / 100);

    // Create booking with pending status
    const { data: booking, error: bookingError } = await supabase
      .from('bookings')
      .insert([
        {
          service_id,
          booking_date,
          booking_time,
          customer_name,
          customer_email,
          customer_phone,
          total_amount: totalAmount,
          deposit_amount: depositAmount,
          status: 'pending',
          payment_status: 'pending',
        },
      ])
      .select()
      .single();

    if (bookingError) throw bookingError;

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `Deposit for ${service.name}`,
              description: `Booking on ${booking_date} at ${booking_time}`,
            },
            unit_amount: depositAmount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/confirmation?id=${booking.id}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/book?service=${service_id}`,
      metadata: {
        booking_id: booking.id,
      },
    });

    // Update booking with payment intent ID
    await supabase
      .from('bookings')
      .update({ stripe_payment_intent_id: session.id })
      .eq('id', booking.id);

    return NextResponse.json({
      booking,
      checkoutUrl: session.url,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

