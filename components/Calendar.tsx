'use client';

import { useState } from 'react';
import { format, addDays, startOfWeek, isSameDay, isPast } from 'date-fns';

interface CalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  unavailableDates?: string[]; // Array of dates in YYYY-MM-DD format
}

export default function Calendar({ selectedDate, onDateSelect, unavailableDates = [] }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const startDate = startOfWeek(currentMonth, { weekStartsOn: 0 });
  const days = Array.from({ length: 42 }, (_, i) => addDays(startDate, i));

  const isUnavailable = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return unavailableDates.includes(dateStr) || isPast(date) && !isSameDay(date, new Date());
  };

  const isSelected = (date: Date) => {
    return selectedDate && isSameDay(date, selectedDate);
  };

  const monthName = format(currentMonth, 'MMMM yyyy');

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h3 className="text-xl font-semibold text-gray-900">{monthName}</h3>
        <button
          onClick={goToNextMonth}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          const unavailable = isUnavailable(day);
          const selected = isSelected(day);
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();

          return (
            <button
              key={index}
              onClick={() => !unavailable && onDateSelect(day)}
              disabled={unavailable}
              className={`
                aspect-square p-2 rounded-lg text-sm font-medium transition-colors
                ${!isCurrentMonth ? 'text-gray-300' : ''}
                ${unavailable ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-100'}
                ${selected ? 'bg-[#059669] text-white hover:bg-[#047857]' : 'text-gray-700'}
              `}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}

