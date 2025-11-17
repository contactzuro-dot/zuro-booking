'use client';

import { useState, useEffect } from 'react';
import { BusinessHours } from '@/lib/types';
import { supabase } from '@/lib/supabase';

const DAYS = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function HoursForm() {
  const [hours, setHours] = useState<Record<number, BusinessHours>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchHours() {
      const { data } = await supabase
        .from('business_hours')
        .select('*')
        .order('day_of_week');

      if (data) {
        const hoursMap: Record<number, BusinessHours> = {};
        data.forEach((h) => {
          hoursMap[h.day_of_week] = h;
        });
        setHours(hoursMap);
      }
      setLoading(false);
    }

    fetchHours();
  }, []);

  const updateDay = async (dayOfWeek: number, field: string, value: any) => {
    const current = hours[dayOfWeek] || {
      day_of_week: dayOfWeek,
      open_time: '09:00',
      close_time: '17:00',
      is_closed: false,
    };

    const updated = { ...current, [field]: value };

    setHours({ ...hours, [dayOfWeek]: updated });

    setSaving(true);
    if (current.id) {
      await supabase
        .from('business_hours')
        .update({ [field]: value })
        .eq('id', current.id);
    } else {
      const { data } = await supabase
        .from('business_hours')
        .insert([updated])
        .select()
        .single();

      if (data) {
        setHours({ ...hours, [dayOfWeek]: data });
      }
    }
    setSaving(false);
  };

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Business Hours</h2>
      {saving && (
        <div className="mb-4 text-sm text-gray-600">Saving...</div>
      )}

      <div className="space-y-4">
        {DAYS.map((day) => {
          const dayHours = hours[day.value] || {
            day_of_week: day.value,
            open_time: '09:00',
            close_time: '17:00',
            is_closed: false,
          };

          return (
            <div key={day.value} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg">
              <div className="w-24">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={!dayHours.is_closed}
                    onChange={(e) => updateDay(day.value, 'is_closed', !e.target.checked)}
                    className="rounded"
                  />
                  <span className="font-medium text-gray-900">{day.label}</span>
                </label>
              </div>

              {!dayHours.is_closed && (
                <>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Open:</label>
                    <input
                      type="time"
                      value={dayHours.open_time}
                      onChange={(e) => updateDay(day.value, 'open_time', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <label className="text-sm text-gray-600">Close:</label>
                    <input
                      type="time"
                      value={dayHours.close_time}
                      onChange={(e) => updateDay(day.value, 'close_time', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                </>
              )}

              {dayHours.is_closed && (
                <span className="text-sm text-gray-500">Closed</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

