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
  const hasActiveFilters = filters.kecamatan || filters.harga_max || filters.sesi_buka ||
    filters.suasana || filters.ac || filters.wifi || filters.mushola ||
    filters.toilet || filters.parkir || filters.ruang_rapat || filters.colokan;

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
        {/* Kecamatan */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Kecamatan</label>
          <select
            value={filters.kecamatan || ''}
            onChange={(e) => onFilterChange('kecamatan', e.target.value || undefined)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Kecamatan</option>
            {filterOptions?.kecamatan.map((k) => (
              <option key={k} value={k}>{k}</option>
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

        {/* Suasana */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Suasana</label>
          <select
            value={filters.suasana || ''}
            onChange={(e) => onFilterChange('suasana', e.target.value || undefined)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">Semua Suasana</option>
            {filterOptions?.suasana.map((s) => (
              <option key={s} value={s} className="capitalize">{s}</option>
            ))}
          </select>
        </div>

        {/* Fasilitas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fasilitas</label>
          <div className="grid grid-cols-2 gap-2">
            {([
              ['wifi', 'WiFi'],
              ['ac', 'AC'],
              ['mushola', 'Mushola'],
              ['toilet', 'Toilet'],
              ['parkir', 'Parkir'],
              ['ruang_rapat', 'R. Rapat'],
              ['colokan', 'Colokan'],
            ] as const).map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={!!filters[key]}
                  onChange={(e) => onFilterChange(key, e.target.checked || undefined)}
                  className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
