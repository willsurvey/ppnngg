'use client';
import { useState } from 'react';
import { Wifi, Car, Zap, Building, Thermometer, Bath, BookOpen } from 'lucide-react';
import { adminCafeApi } from '@/lib/api/adminApi';
import type { Fasilitas } from '@/types';

interface FasilitasToggleProps {
  cafeId: number;
  fasilitas: Fasilitas | null;
  onFasilitasChange: (fasilitas: Fasilitas) => void;
}

const FASILITAS_ITEMS: { key: keyof Fasilitas; label: string; icon: React.ElementType }[] = [
  { key: 'ac', label: 'AC', icon: Thermometer },
  { key: 'wifi', label: 'Wi-Fi', icon: Wifi },
  { key: 'toilet', label: 'Toilet', icon: Bath },
  { key: 'mushola', label: 'Mushola', icon: BookOpen },
  { key: 'ruang_rapat', label: 'Ruang Rapat', icon: Building },
  { key: 'parkir', label: 'Parkir', icon: Car },
  { key: 'colokan', label: 'Colokan', icon: Zap },
];

export default function FasilitasToggle({ cafeId, fasilitas, onFasilitasChange }: FasilitasToggleProps) {
  const [saving, setSaving] = useState<string | null>(null);

  const current: Fasilitas = fasilitas || {
    ac: false, wifi: false, toilet: false, mushola: false,
    ruang_rapat: false, parkir: false, colokan: false,
  };

  const handleToggle = async (key: keyof Fasilitas) => {
    const updated = { ...current, [key]: !current[key] };
    onFasilitasChange(updated);
    setSaving(key);
    try {
      await adminCafeApi.updateFasilitas(cafeId, updated);
    } catch (error) {
      // Revert on error
      onFasilitasChange(current);
      alert('Gagal mengubah fasilitas');
    } finally {
      setSaving(null);
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-gray-900">Fasilitas</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {FASILITAS_ITEMS.map(({ key, label, icon: Icon }) => {
          const isActive = current[key];
          const isLoading = saving === key;
          return (
            <button
              key={key}
              onClick={() => handleToggle(key)}
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
              <Icon className={`w-5 h-5 ${isActive ? 'text-primary-600' : 'text-gray-400'}`} />
              <span className="text-sm font-medium">{label}</span>
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
