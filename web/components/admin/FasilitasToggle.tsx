'use client';
import { useState, useEffect } from 'react';
import { adminCafeApi } from '@/lib/api/adminApi';
import { cafeApi } from '@/lib/api/cafeApi';
import type { Fasilitas } from '@/types';

interface FasilitasToggleProps {
  cafeId: number;
  selectedFasilitasIds: number[];
  onFasilitasChange: (ids: number[]) => void;
}

export default function FasilitasToggle({ cafeId, selectedFasilitasIds, onFasilitasChange }: FasilitasToggleProps) {
  const [allFasilitas, setAllFasilitas] = useState<Fasilitas[]>([]);
  const [saving, setSaving] = useState<number | null>(null);

  useEffect(() => {
    cafeApi.getFasilitas().then(setAllFasilitas).catch(() => {});
  }, []);

  const handleToggle = async (fasilitasId: number) => {
    const current = [...selectedFasilitasIds];
    const idx = current.indexOf(fasilitasId);
    if (idx >= 0) {
      current.splice(idx, 1);
    } else {
      current.push(fasilitasId);
    }
    onFasilitasChange(current);
    setSaving(fasilitasId);
    try {
      await adminCafeApi.setFasilitas(cafeId, current);
    } catch {
      // revert on error
      onFasilitasChange(selectedFasilitasIds);
      alert('Gagal mengubah fasilitas');
    } finally {
      setSaving(null);
    }
  };

  if (allFasilitas.length === 0) {
    return <p className="text-sm text-gray-500">Memuat fasilitas...</p>;
  }

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-gray-900">Fasilitas</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {allFasilitas.map((f) => {
          const isActive = selectedFasilitasIds.includes(f.id);
          const isLoading = saving === f.id;
          return (
            <button
              key={f.id}
              onClick={() => handleToggle(f.id)}
              disabled={isLoading}
              className={`
                flex items-center gap-3 p-3 rounded-lg border-2 transition-all text-left
                ${isActive
                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                  : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                }
                ${isLoading ? 'opacity-50' : ''}
              `}
            >
              <span className="text-sm font-medium">{f.nama_fasilitas}</span>
              <span className={`ml-auto w-5 h-5 rounded-full flex items-center justify-center text-xs
                ${isActive ? 'bg-primary-500 text-white' : 'bg-gray-200 text-gray-400'}
              `}>
                {isActive ? '✓' : '—'}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
