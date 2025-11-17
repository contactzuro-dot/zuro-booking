'use client';

import { TimeSlot } from '@/lib/types';

interface TimeSelectorProps {
  timeSlots: TimeSlot[];
  selectedTime: string | null;
  onTimeSelect: (time: string) => void;
  loading?: boolean;
}

export default function TimeSelector({ timeSlots, selectedTime, onTimeSelect, loading }: TimeSelectorProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#059669]"></div>
        </div>
      </div>
    );
  }

  if (timeSlots.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
        <p className="text-gray-500 text-center py-8">No available times for this date.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Select Time</h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            onClick={() => slot.available && onTimeSelect(slot.time)}
            disabled={!slot.available}
            className={`
              py-3 px-4 rounded-lg text-sm font-medium transition-colors
              ${!slot.available
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : selectedTime === slot.time
                ? 'bg-[#059669] text-white hover:bg-[#047857]'
                : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
              }
            `}
          >
            {slot.time}
          </button>
        ))}
      </div>
    </div>
  );
}

