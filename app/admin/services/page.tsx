'use client';

import { useEffect, useState } from 'react';
import { Service } from '@/lib/types';
import { supabase } from '@/lib/supabase';

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 60,
    price: 0,
    deposit_percent: 20,
  });

  useEffect(() => {
    fetchServices();
  }, []);

  async function fetchServices() {
    const { data } = await supabase
      .from('services')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setServices(data);
    }
    setLoading(false);
  }

  function handleEdit(service: Service) {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price / 100,
      deposit_percent: service.deposit_percent,
    });
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setEditingService(null);
    setFormData({
      name: '',
      description: '',
      duration: 60,
      price: 0,
      deposit_percent: 20,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const serviceData = {
      name: formData.name,
      description: formData.description,
      duration: formData.duration,
      price: Math.round(formData.price * 100),
      deposit_percent: formData.deposit_percent,
    };

    if (editingService) {
      await supabase
        .from('services')
        .update(serviceData)
        .eq('id', editingService.id);
    } else {
      await supabase
        .from('services')
        .insert([serviceData]);
    }

    handleCancel();
    fetchServices();
  }

  async function handleDelete(id: string) {
    if (!confirm('Are you sure you want to delete this service?')) return;

    await supabase
      .from('services')
      .delete()
      .eq('id', id);

    fetchServices();
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Services</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#059669] text-white px-6 py-2 rounded-lg hover:bg-[#047857] transition-colors"
        >
          Add Service
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {editingService ? 'Edit Service' : 'New Service'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deposit (%)</label>
                <input
                  type="number"
                  required
                  min="0"
                  max="100"
                  value={formData.deposit_percent}
                  onChange={(e) => setFormData({ ...formData, deposit_percent: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              </div>
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="bg-[#059669] text-white px-6 py-2 rounded-lg hover:bg-[#047857] transition-colors"
              >
                {editingService ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Duration</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deposit</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {services.map((service) => (
              <tr key={service.id}>
                <td className="px-6 py-4">
                  <div className="font-medium text-gray-900">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.description}</div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-900">{service.duration} min</td>
                <td className="px-6 py-4 text-sm text-gray-900">${(service.price / 100).toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{service.deposit_percent}%</td>
                <td className="px-6 py-4 text-sm font-medium">
                  <button
                    onClick={() => handleEdit(service)}
                    className="text-[#059669] hover:text-[#047857] mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

