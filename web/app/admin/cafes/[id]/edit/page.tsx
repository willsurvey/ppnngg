'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Settings, ImageIcon, FileText } from 'lucide-react';
import CafeForm from '@/components/admin/CafeForm';
import FotoManager from '@/components/admin/FotoManager';
import FasilitasToggle from '@/components/admin/FasilitasToggle';
import { adminCafeApi } from '@/lib/api/adminApi';
import { cafeApi } from '@/lib/api/cafeApi';
import type { CafeDetail, CreateCafeRequest, Fasilitas, FotoCafe } from '@/types';

type Tab = 'detail' | 'fasilitas' | 'foto';

export default function AdminEditCafePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [cafe, setCafe] = useState<CafeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('detail');
  const [fasilitas, setFasilitas] = useState<Fasilitas | null>(null);
  const [fotos, setFotos] = useState<FotoCafe[]>([]);

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const result = await cafeApi.getAllCafes({ limit: 100 });
        const found = result.data.find((c) => c.id === id);
        if (found) {
          const detail = await cafeApi.getCafeBySlug(found.slug);
          setCafe(detail);
          setFasilitas(detail.fasilitas || null);
          setFotos(detail.fotos || []);
        }
      } catch (error) {
        console.error('Failed to load cafe:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCafe();
  }, [id]);

  const handleSubmit = async (data: CreateCafeRequest) => {
    await adminCafeApi.updateCafe(id, data);
    router.push('/admin/cafes');
  };

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'detail', label: 'Detail Cafe', icon: FileText },
    { key: 'fasilitas', label: 'Fasilitas', icon: Settings },
    { key: 'foto', label: `Foto (${fotos.length})`, icon: ImageIcon },
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3" />
          <div className="h-96 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!cafe) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Cafe tidak ditemukan</p>
        <Link href="/admin/cafes" className="text-primary-600 hover:text-primary-800 mt-2 inline-block">
          Kembali ke daftar cafe
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/cafes" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm w-fit">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Cafe: {cafe.nama}</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${activeTab === key
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
              }
            `}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'detail' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <CafeForm
            initialData={{
              nama: cafe.nama,
              alamat: cafe.alamat,
              kecamatan: cafe.kecamatan,
              latitude: cafe.latitude,
              longitude: cafe.longitude,
              harga_min: cafe.harga_min,
              harga_max: cafe.harga_max,
              jam_buka: cafe.jam_buka,
              jam_tutup: cafe.jam_tutup,
              buka_24jam: cafe.buka_24jam,
              sesi_buka: cafe.sesi_buka,
              suasana: cafe.suasana,
              instagram: cafe.instagram,
              google_maps_url: cafe.google_maps_url,
            }}
            onSubmit={handleSubmit}
            submitLabel="Update Cafe"
          />
        </div>
      )}

      {activeTab === 'fasilitas' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <FasilitasToggle
            cafeId={id}
            fasilitas={fasilitas}
            onFasilitasChange={setFasilitas}
          />
        </div>
      )}

      {activeTab === 'foto' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <FotoManager
            cafeId={id}
            fotos={fotos}
            onFotosChange={setFotos}
          />
        </div>
      )}
    </div>
  );
}
