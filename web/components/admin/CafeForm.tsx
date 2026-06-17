'use client';
import { useState, useEffect } from 'react';
import type { CreateCafeRequest, Lokasi } from '@/types';
import { cafeApi } from '@/lib/api/cafeApi';

interface CafeFormProps {
  initialData?: Partial<CreateCafeRequest>;
  onSubmit: (data: CreateCafeRequest) => Promise<void>;
  submitLabel: string;
}

const SESI_OPTIONS = ['pagi', 'siang', 'malam'];

export default function CafeForm({ initialData, onSubmit, submitLabel }: CafeFormProps) {
  const [lokasiList, setLokasiList] = useState<Lokasi[]>([]);
  const [formData, setFormData] = useState<CreateCafeRequest>({
    nama_cafe: initialData?.nama_cafe || '',
    lokasi_id: initialData?.lokasi_id || 0,
    alamat: initialData?.alamat || '',
    latitude: initialData?.latitude,
    longitude: initialData?.longitude,
    no_telepon: initialData?.no_telepon || '',
    harga_min: initialData?.harga_min,
    harga_max: initialData?.harga_max,
    deskripsi: initialData?.deskripsi || '',
    sesi_buka: initialData?.sesi_buka || '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    cafeApi.getLokasi().then(setLokasiList).catch(() => {});
  }, []);

  const handleChange = (field: keyof CreateCafeRequest, value: string | number | undefined) => {
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
        {/* Nama Cafe */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Nama Cafe *</label>
          <input
            type="text"
            value={formData.nama_cafe}
            onChange={(e) => handleChange('nama_cafe', e.target.value)}
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

        {/* Lokasi / Kecamatan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan *</label>
          <select
            value={formData.lokasi_id || ''}
            onChange={(e) => handleChange('lokasi_id', e.target.value ? Number(e.target.value) : undefined)}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Pilih Kecamatan</option>
            {lokasiList.map((l) => <option key={l.id} value={l.id}>{l.nama_kecamatan}</option>)}
          </select>
        </div>

        {/* Sesi Buka */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sesi Buka</label>
          <select
            value={formData.sesi_buka}
            onChange={(e) => handleChange('sesi_buka', e.target.value || undefined)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Pilih Sesi</option>
            {SESI_OPTIONS.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>

        {/* No Telepon */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">No. Telepon</label>
          <input
            type="text"
            value={formData.no_telepon}
            onChange={(e) => handleChange('no_telepon', e.target.value)}
            placeholder="08xxxxxxxxxx"
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

        {/* Deskripsi */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
          <textarea
            value={formData.deskripsi}
            onChange={(e) => handleChange('deskripsi', e.target.value)}
            rows={3}
            placeholder="Deskripsi singkat tentang cafe..."
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
