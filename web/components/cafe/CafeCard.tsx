'use client';
import Link from 'next/link';
import { MapPin, Coffee, Clock } from 'lucide-react';
import { formatRupiahShort } from '@/lib/utils/formatRupiah';
import type { CafeListItem } from '@/types';

interface CafeCardProps {
  cafe: CafeListItem;
}

export default function CafeCard({ cafe }: CafeCardProps) {
  return (
    <Link href={`/cafes/${cafe.slug}`} className="group">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
        {/* Thumbnail */}
        <div className="relative h-48 bg-gray-200">
          {cafe.thumbnail ? (
            <img
              src={cafe.thumbnail}
              alt={cafe.nama_cafe}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <Coffee className="w-12 h-12" />
            </div>
          )}
          {/* Completeness badge */}
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              cafe.completeness_score >= 80 ? 'bg-green-100 text-green-800' :
              cafe.completeness_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {cafe.completeness_score}% lengkap
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-900 group-hover:text-primary-700 transition-colors">
            {cafe.nama_cafe}
          </h3>

          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{cafe.lokasi?.nama_kecamatan || '-'}</span>
          </div>

          <div className="flex items-center gap-1 mt-1 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            <span className="capitalize">{cafe.sesi_buka}</span>
          </div>

          {/* Price range */}
          <div className="mt-3 flex items-center justify-between">
            <span className="text-sm font-medium text-primary-700">
              {formatRupiahShort(cafe.harga_min || 0)} - {formatRupiahShort(cafe.harga_max || 0)}
            </span>
          </div>

          {/* Kategori badges */}
          {cafe.kategori && cafe.kategori.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {cafe.kategori.slice(0, 3).map(k => (
                <span key={k.id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                  {k.nama_kategori}
                </span>
              ))}
            </div>
          )}

          {/* Fasilitas badges */}
          {cafe.fasilitas && cafe.fasilitas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {cafe.fasilitas.slice(0, 5).map(f => (
                <span key={f.id} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded">
                  {f.nama_fasilitas}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
