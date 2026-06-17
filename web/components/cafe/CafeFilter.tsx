'use client';
import { X } from 'lucide-react';
import type { CafeFilters, FilterOptions } from '@/types';

interface CafeFilterProps {
  filters: CafeFilters;
  filterOptions: FilterOptions | null;
  onFilterChange: (key: keyof CafeFilters, value: unknown) => void;
  onReset: () => void;
}

export default function CafeFilter({ filters, filterOptions, onFilterChange, onReset }: CafeFilterProps) {
  const hasActiveFilters = filters.lokasi_id || filters.harga_max || filters.sesi_buka ||
    filters.kategori_id || filters.fasilitas_ids;

  // Parse fasilitas_ids from comma-separated string
  const selectedFasilitasIds = filters.fasilitas_ids
    ? filters.fasilitas_ids.split(',').map(Number)
    : [];

  const handleFasilitasToggle = (id: number) => {
    const current = [...selectedFasilitasIds];
    const idx = current.indexOf(id);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(id);
    }
    onFilterChange('fasilitas_ids', current.length > 0 ? current.join(',') : undefined);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-900">Filter Cafe</h3>
        {hasActiveFilters && (
          <button onClick={onReset} className="flex items-center gap-1 text-sm text-red-600 hover:text-red-800">
            <X className="w-4 h-4" />
            Reset
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Lokasi */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
          <select
            value={filters.lokasi_id || ''}
            onChange={(e) => onFilterChange('lokasi_id', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Kecamatan</option>
            {filterOptions?.lokasi.map((l) => (
              <option key={l.id} value={l.id}>{l.nama_kecamatan}</option>
            ))}
          </select>
        </div>

        {/* Harga Max */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Harga Maximum</label>
          <select
            value={filters.harga_max || ''}
            onChange={(e) => onFilterChange('harga_max', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Harga</option>
            <option value="10000">Maks Rp10.000</option>
            <option value="20000">Maks Rp20.000</option>
            <option value="30000">Maks Rp30.000</option>
            <option value="50000">Maks Rp50.000</option>
          </select>
        </div>

        {/* Sesi Buka */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Sesi Buka</label>
          <select
            value={filters.sesi_buka || ''}
            onChange={(e) => onFilterChange('sesi_buka', e.target.value || undefined)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Sesi</option>
            {filterOptions?.sesi_buka.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        {/* Kategori */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kategori / Suasana</label>
          <select
            value={filters.kategori_id || ''}
            onChange={(e) => onFilterChange('kategori_id', e.target.value ? Number(e.target.value) : undefined)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Kategori</option>
            {filterOptions?.kategori.map((k) => (
              <option key={k.id} value={k.id}>{k.nama_kategori}</option>
            ))}
          </select>
        </div>

        {/* Fasilitas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fasilitas</label>
          <div className="grid grid-cols-2 gap-2">
            {filterOptions?.fasilitas.map((f) => (
              <label key={f.id} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedFasilitasIds.includes(f.id)}
                  onChange={() => handleFasilitasToggle(f.id)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{f.nama_fasilitas}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
