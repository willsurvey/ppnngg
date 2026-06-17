'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MapPin, Clock, Phone, FileText } from 'lucide-react';
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
        <CafeCarousel fotos={cafe.fotos} cafeName={cafe.nama_cafe} />

        {/* Basic Info */}
        <div>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{cafe.nama_cafe}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-500">
                <MapPin className="w-4 h-4" />
                <span>{cafe.alamat}, {cafe.lokasi?.nama_kecamatan || '-'}</span>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              cafe.completeness_score >= 80 ? 'bg-green-100 text-green-800' :
              cafe.completeness_score >= 50 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {cafe.completeness_score}% lengkap
            </span>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Details */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="font-semibold text-lg text-gray-900">Informasi</h2>

            <div className="space-y-3">
              <InfoRow label="Kecamatan" value={cafe.lokasi?.nama_kecamatan || '-'} />
              <InfoRow label="Sesi Buka" value={cafe.sesi_buka} capitalize />
              <InfoRow
                label="Range Harga"
                value={`${formatRupiah(cafe.harga_min)} - ${formatRupiah(cafe.harga_max)}`}
              />
              {cafe.no_telepon && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-900">{cafe.no_telepon}</span>
                </div>
              )}
              {cafe.deskripsi && (
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm text-gray-700">{cafe.deskripsi}</span>
                </div>
              )}
            </div>
          </div>

          {/* Kategori & Fasilitas */}
          <div className="space-y-6">
            {/* Kategori */}
            {cafe.kategori && cafe.kategori.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-3">Kategori</h2>
                <div className="flex flex-wrap gap-2">
                  {cafe.kategori.map(k => (
                    <span key={k.id} className="px-3 py-1.5 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                      {k.nama_kategori}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Fasilitas */}
            {cafe.fasilitas && cafe.fasilitas.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                <h2 className="font-semibold text-lg text-gray-900 mb-3">Fasilitas</h2>
                <div className="grid grid-cols-2 gap-3">
                  {cafe.fasilitas.map(f => (
                    <div
                      key={f.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-green-50 text-green-700"
                    >
                      <span className="text-sm">{f.nama_fasilitas}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Jam Buka */}
        {cafe.jam_buka && cafe.jam_buka.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-semibold text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary-600" />
              Jam Operasional
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {cafe.jam_buka.map(jb => (
                <div key={jb.hari} className="flex items-center justify-between py-2 px-3 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium capitalize text-gray-700">{jb.hari}</span>
                  <span className="text-sm text-gray-600">
                    {jb.is_tutup ? (
                      <span className="text-red-500 font-medium">Tutup</span>
                    ) : (
                      `${jb.jam_buka?.slice(0, 5) || '-'} - ${jb.jam_tutup?.slice(0, 5) || '-'}`
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Map */}
        {cafe.latitude && cafe.longitude && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <CafeMap
              latitude={parseFloat(String(cafe.latitude))}
              longitude={parseFloat(String(cafe.longitude))}
              cafeName={cafe.nama_cafe}
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
