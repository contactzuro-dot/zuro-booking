'use client';

import { useEffect, useState } from 'react';
import { Booking } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import BookingTable from '@/components/BookingTable';

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  async function fetchBookings() {
    const { data } = await supabase
      .from('bookings')
      .select(`
        *,
        service:services(*)
      `)
      .order('booking_date', { ascending: false })
      .order('booking_time', { ascending: false });

    if (data) {
      setBookings(data as Booking[]);
    }
    setLoading(false);
  }

  async function handleStatusChange(bookingId: string, status: Booking['status']) {
    await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    fetchBookings();
  }

  function handleExport() {
    const headers = ['ID', 'Customer Name', 'Email', 'Phone', 'Service', 'Date', 'Time', 'Status', 'Total Amount', 'Deposit'];
    const rows = bookings.map((b) => [
      b.id,
      b.customer_name,
      b.customer_email,
      b.customer_phone,
      b.service?.name || 'N/A',
      b.booking_date,
      b.booking_time,
      b.status,
      (b.total_amount / 100).toFixed(2),
      (b.deposit_amount / 100).toFixed(2),
    ]);

    const csv = [headers, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#059669]"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Bookings</h1>
      <BookingTable
        bookings={bookings}
        onStatusChange={handleStatusChange}
        onExport={handleExport}
      />
    </div>
  );
}

