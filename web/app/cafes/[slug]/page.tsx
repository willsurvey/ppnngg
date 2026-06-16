'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Instagram, Wifi, Wind, Bath, BookOpen, Users, Car, Plug } from 'lucide-react';
import CafeCarousel from '@/components/cafe/CafeCarousel';
import CafeMap from '@/components/cafe/CafeMap';
import { useCafeDetail } from '@/hooks/useCafeDetail';
import { formatRupiah } from '@/lib/utils/formatRupiah';

export default function CafeDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { cafe, loading, error } = useCafeDetail(slug);

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3" />
            <div className="h-96 bg-gray-200 rounded-xl" />
            <div className="space-y-3">
              <div className="h-5 bg-gray-200 rounded w-2/3" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error || !cafe) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Cafe Tidak Ditemukan</h1>
          <p className="text-gray-500 mt-2">{error || 'Cafe yang Anda cari tidak ada.'}</p>
          <Link href="/cafes" className="mt-4 inline-block text-primary-600 hover:text-primary-800 font-medium">
            Kembali ke Daftar Cafe
          </Link>
        </div>
      </main>
    );
  }

  const fasilitasIcons = {
    wifi: { icon: Wifi, label: 'WiFi' },
    ac: { icon: Wind, label: 'AC' },
    toilet: { icon: Bath, label: 'Toilet' },
    mushola: { icon: BookOpen, label: 'Mushola' },
    ruang_rapat: { icon: Users, label: 'Ruang Rapat' },
    parkir: { icon: Car, label: 'Parkir' },
    colokan: { icon: Plug, label: 'Colokan' },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link href="/cafes" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Photo Carousel */}
        <CafeCarousel fotos={cafe.fotos} cafeName={cafe.nama} />

        {/* Basic Info */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cafe.nama}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{cafe.alamat}, {cafe.kecamatan}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              cafe.completeness_pct >= 80 ? 'bg-green-100 text-green-800' :
              cafe.completeness_pct >= 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {cafe.completeness_pct}% lengkap
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-lg text-gray-900">Informasi</h2>

            <div className="space-y-3">
              <InfoRow label="Kecamatan" value={cafe.kecamatan} />
              <InfoRow label="Suasana" value={cafe.suasana} capitalize />
              <InfoRow label="Sesi Buka" value={cafe.sesi_buka} capitalize />
              <InfoRow
                label="Jam Operasional"
                value={cafe.buka_24jam ? '24 Jam' : `${cafe.jam_buka} - ${cafe.jam_tutup}`}
              />
              <InfoRow
                label="Range Harga"
                value={`${formatRupiah(cafe.harga_min)} - ${formatRupiah(cafe.harga_max)}`}
              />
              {cafe.instagram && (
                <div className="flex items-center gap-2">
                  <Instagram className="w-4 h-4 text-gray-400" />
                  <a
                    href={`https://instagram.com/${cafe.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-800 text-sm"
                  >
                    @{cafe.instagram}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Fasilitas */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4">Fasilitas</h2>
            <div className="grid grid-cols-2 gap-3">
              {cafe.fasilitas && Object.entries(fasilitasIcons).map(([key, { icon: Icon, label }]) => {
                const hasFacility = cafe.fasilitas?.[key as keyof typeof cafe.fasilitas];
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-2 p-2 rounded-lg ${
                      hasFacility ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Map */}
        {cafe.latitude && cafe.longitude && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <CafeMap
              latitude={parseFloat(String(cafe.latitude))}
              longitude={parseFloat(String(cafe.longitude))}
              cafeName={cafe.nama}
              googleMapsUrl={cafe.google_maps_url}
            />
          </div>
        )}
      </div>
    </main>
  );
}

function InfoRow({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-500">{label}</span>
      <span className={`text-sm font-medium text-gray-900 ${capitalize ? 'capitalize' : ''}`}>{value}</span>
    </div>
  );
}
