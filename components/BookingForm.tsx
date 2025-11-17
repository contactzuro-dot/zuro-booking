'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface BookingFormProps {
  serviceId: string;
  selectedDate: Date;
  selectedTime: string;
  depositAmount: number;
}

export default function BookingForm({ serviceId, selectedDate, selectedTime, depositAmount }: BookingFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service_id: serviceId,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create booking');
      }

      const { booking, checkoutUrl } = await response.json();

      // Redirect to Stripe Checkout
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        router.push(`/confirmation?id=${booking.id}`);
      }
    } catch (error: any) {
      alert(error.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Information</h3>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name *
        </label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email *
        </label>
        <input
          type="email"
          id="email"
          required
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent"
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
          Phone Number *
        </label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#059669] focus:border-transparent"
        />
      </div>

      <div className="pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm text-gray-600">Deposit Amount</span>
          <span className="text-lg font-semibold text-[#059669]">
            ${(depositAmount / 100).toFixed(2)}
          </span>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#059669] text-white py-3 px-6 rounded-lg font-medium hover:bg-[#047857] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Processing...' : 'Proceed to Payment'}
        </button>
      </div>
    </form>
  );
}

