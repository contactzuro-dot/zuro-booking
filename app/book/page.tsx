'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Calendar from '@/components/Calendar';
import TimeSelector from '@/components/TimeSelector';
import BookingForm from '@/components/BookingForm';
import { Service, TimeSlot } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';

export default function BookPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const serviceId = searchParams.get('service');

  const [service, setService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [step, setStep] = useState<'date' | 'time' | 'form'>('date');

  useEffect(() => {
    if (!serviceId) {
      router.push('/services');
      return;
    }

    async function fetchService() {
      const { data } = await supabase
        .from('services')
        .select('*')
        .eq('id', serviceId)
        .single();

      if (data) {
        setService(data);
      } else {
        router.push('/services');
      }
    }

    fetchService();
  }, [serviceId, router]);

  useEffect(() => {
    if (selectedDate && service) {
      setLoadingTimeSlots(true);
      fetchTimeSlots();
    }
  }, [selectedDate, service]);

  async function fetchTimeSlots() {
    if (!selectedDate || !service) return;

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const response = await fetch(`/api/availability?date=${dateStr}&serviceId=${service.id}`);
      const data = await response.json();
      setTimeSlots(data.timeSlots || []);
      setStep('time');
    } catch (error) {
      console.error('Error fetching time slots:', error);
    } finally {
      setLoadingTimeSlots(false);
    }
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#059669]"></div>
      </div>
    );
  }

  const depositAmount = Math.round((service.price * service.deposit_percent) / 100);

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="text-2xl font-bold text-[#059669]">
              Zuro
            </Link>
            <Link
              href="/services"
              className="text-gray-700 hover:text-[#059669] transition-colors"
            >
              ← Back to Services
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{service.name}</h1>
          <p className="text-gray-600">{service.description}</p>
          <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
            <span>Duration: {service.duration} minutes</span>
            <span>•</span>
            <span>Price: ${(service.price / 100).toFixed(2)}</span>
            <span>•</span>
            <span>Deposit: ${(depositAmount / 100).toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-6">
          {step === 'date' && (
            <Calendar
              selectedDate={selectedDate}
              onDateSelect={(date) => {
                setSelectedDate(date);
                setSelectedTime(null);
              }}
            />
          )}

          {step === 'time' && selectedDate && (
            <>
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-500">Selected Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setStep('date');
                      setSelectedTime(null);
                    }}
                    className="text-[#059669] hover:text-[#047857] text-sm"
                  >
                    Change
                  </button>
                </div>
              </div>

              <TimeSelector
                timeSlots={timeSlots}
                selectedTime={selectedTime}
                onTimeSelect={(time) => {
                  setSelectedTime(time);
                  setStep('form');
                }}
                loading={loadingTimeSlots}
              />
            </>
          )}

          {step === 'form' && selectedDate && selectedTime && (
            <>
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="text-sm text-gray-500">Selected Date</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {format(selectedDate, 'EEEE, MMMM d, yyyy')}
                    </p>
                  </div>
                  <button
                    onClick={() => setStep('date')}
                    className="text-[#059669] hover:text-[#047857] text-sm"
                  >
                    Change
                  </button>
                </div>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Selected Time</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedTime}</p>
                </div>
                <button
                  onClick={() => setStep('time')}
                  className="mt-2 text-[#059669] hover:text-[#047857] text-sm"
                >
                  Change
                </button>
              </div>

              <BookingForm
                serviceId={service.id}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                depositAmount={depositAmount}
              />
            </>
          )}
        </div>
      </main>
    </div>
  );
}

