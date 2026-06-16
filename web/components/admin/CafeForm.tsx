'use client';
import { useState } from 'react';
import type { CreateCafeRequest } from '@/types';

interface CafeFormProps {
  initialData?: Partial<CreateCafeRequest>;
  onSubmit: (data: CreateCafeRequest) => Promise<void>;
  submitLabel: string;
}

const KECAMATAN_OPTIONS = [
  'Ponorogo', 'Babadan', 'Jenangan', 'Mlarak', 'Siman',
  'Balong', 'Kauman', 'Ngebel', 'Sooko', 'Pulung',
  'Mungkal', 'Slahung', 'Ngrayun', 'Bungkal', 'Sawoo',
  'Sampung', 'Sukorejo', 'Badegan', 'Jambon', 'Pudak'
];

const SESI_OPTIONS = ['pagi', 'siang', 'sore', 'malam', '24jam'];

export default function CafeForm({ initialData, onSubmit, submitLabel }: CafeFormProps) {
  const [formData, setFormData] = useState<CreateCafeRequest>({
    nama: initialData?.nama || '',
    alamat: initialData?.alamat || '',
    kecamatan: initialData?.kecamatan || '',
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    harga_min: initialData?.harga_min,
    harga_max: initialData?.harga_max,
    jam_buka: initialData?.jam_buka || '',
    jam_tutup: initialData?.jam_tutup || '',
    buka_24jam: initialData?.buka_24jam || false,
    sesi_buka: initialData?.sesi_buka || '',
    suasana: initialData?.suasana || '',
    instagram: initialData?.instagram || '',
    google_maps_url: initialData?.google_maps_url || '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof CreateCafeRequest, value: string | number | boolean | undefined) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nama */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cafe *</label>
          <input
            type="text"
            value={formData.nama}
            onChange={(e) => handleChange('nama', e.target.value)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Alamat */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Alamat</label>
          <textarea
            value={formData.alamat}
            onChange={(e) => handleChange('alamat', e.target.value)}
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Kecamatan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
          <select
            value={formData.kecamatan}
            onChange={(e) => handleChange('kecamatan', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Pilih Kecamatan</option>
            {KECAMATAN_OPTIONS.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
        </div>

        {/* Suasana */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suasana</label>
          <input
            type="text"
            value={formData.suasana}
            onChange={(e) => handleChange('suasana', e.target.value)}
            placeholder="aesthetic, study, outdoor, cozy, industrial"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Sesi Buka */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sesi Buka</label>
          <select
            value={formData.sesi_buka}
            onChange={(e) => handleChange('sesi_buka', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Pilih Sesi</option>
            {SESI_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>

        {/* Buka 24 Jam */}
        <div className="flex items-center gap-2 pt-6">
          <input
            type="checkbox"
            checked={formData.buka_24jam}
            onChange={(e) => handleChange('buka_24jam', e.target.checked)}
            className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <label className="text-sm text-gray-700">Buka 24 Jam</label>
        </div>

        {/* Jam Buka */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jam Buka</label>
          <input
            type="time"
            value={formData.jam_buka}
            onChange={(e) => handleChange('jam_buka', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Jam Tutup */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Jam Tutup</label>
          <input
            type="time"
            value={formData.jam_tutup}
            onChange={(e) => handleChange('jam_tutup', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Harga Min */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Harga Minimum (Rp)</label>
          <input
            type="number"
            value={formData.harga_min || ''}
            onChange={(e) => handleChange('harga_min', e.target.value ? Number(e.target.value) : undefined)}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Harga Max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Harga Maximum (Rp)</label>
          <input
            type="number"
            value={formData.harga_max || ''}
            onChange={(e) => handleChange('harga_max', e.target.value ? Number(e.target.value) : undefined)}
            min={0}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Latitude */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
          <input
            type="number"
            step="any"
            value={formData.latitude || ''}
            onChange={(e) => handleChange('latitude', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="-7.866"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Longitude */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
          <input
            type="number"
            step="any"
            value={formData.longitude || ''}
            onChange={(e) => handleChange('longitude', e.target.value ? Number(e.target.value) : undefined)}
            placeholder="111.464"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Instagram */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Instagram</label>
          <input
            type="text"
            value={formData.instagram}
            onChange={(e) => handleChange('instagram', e.target.value)}
            placeholder="username tanpa @"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Google Maps URL */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Google Maps URL</label>
          <input
            type="url"
            value={formData.google_maps_url}
            onChange={(e) => handleChange('google_maps_url', e.target.value)}
            placeholder="https://maps.google.com/?q=..."
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {submitting ? 'Menyimpan...' : submitLabel}
      </button>
    </form>
  );
}
