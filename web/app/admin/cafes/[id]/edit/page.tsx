'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Settings, ImageIcon, FileText, Clock } from 'lucide-react';
import CafeForm from '@/components/admin/CafeForm';
import FotoManager from '@/components/admin/FotoManager';
import FasilitasToggle from '@/components/admin/FasilitasToggle';
import { adminCafeApi } from '@/lib/api/adminApi';
import type { CafeDetail, CreateCafeRequest, FotoCafe, JamBuka, JamBukaInput } from '@/types';

type Tab = 'detail' | 'fasilitas' | 'foto' | 'jam';

export default function AdminEditCafePage() {
  const router = useRouter();
  const params = useParams();
  const id = Number(params.id);
  const [cafe, setCafe] = useState<CafeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('detail');
  const [fasilitasIds, setFasilitasIds] = useState<number[]>([]);
  const [fotos, setFotos] = useState<FotoCafe[]>([]);

  useEffect(() => {
    const fetchCafe = async () => {
      try {
        const detail = await adminCafeApi.getCafeById(id);
        setCafe(detail);
        setFasilitasIds((detail.fasilitas || []).map(f => f.id));
        setFotos(detail.fotos || []);
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
    { key: 'jam', label: 'Jam Buka', icon: Clock },
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
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Edit Cafe: {cafe.nama_cafe}</h1>
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
              nama_cafe: cafe.nama_cafe,
              lokasi_id: cafe.lokasi?.id,
              alamat: cafe.alamat,
              latitude: cafe.latitude,
              longitude: cafe.longitude,
              no_telepon: cafe.no_telepon,
              harga_min: cafe.harga_min,
              harga_max: cafe.harga_max,
              deskripsi: cafe.deskripsi,
              sesi_buka: cafe.sesi_buka,
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
            selectedFasilitasIds={fasilitasIds}
            onFasilitasChange={setFasilitasIds}
          />
        </div>
      )}

      {activeTab === 'jam' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <JamBukaEditor cafeId={id} initialJamBuka={cafe.jam_buka || []} />
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

// Inline JamBuka editor component
const HARI_LIST = ['senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu', 'minggu'];

function JamBukaEditor({ cafeId, initialJamBuka }: { cafeId: number; initialJamBuka: JamBuka[] }) {
  const [jamData, setJamData] = useState<JamBukaInput[]>(() => {
    if (initialJamBuka.length > 0) {
      return initialJamBuka.map(j => ({
        hari: j.hari,
        jam_buka: j.jam_buka?.slice(0, 5) || '',
        jam_tutup: j.jam_tutup?.slice(0, 5) || '',
        is_tutup: j.is_tutup,
      }));
    }
    return HARI_LIST.map(h => ({ hari: h, jam_buka: '', jam_tutup: '', is_tutup: false }));
  });
  const [saving, setSaving] = useState(false);

  const handleChange = (index: number, field: string, value: string | boolean) => {
    setJamData(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await adminCafeApi.setJamBuka(cafeId, jamData);
      alert('Jam buka berhasil disimpan');
    } catch {
      alert('Gagal menyimpan jam buka');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900">Jam Buka</h3>
      <div className="space-y-3">
        {jamData.map((item, index) => (
          <div key={item.hari} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
            <span className="w-20 text-sm font-medium capitalize text-gray-700">{item.hari}</span>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={item.is_tutup || false}
                onChange={(e) => handleChange(index, 'is_tutup', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm text-gray-600">Tutup</span>
            </label>
            <input
              type="time"
              value={item.jam_buka || ''}
              onChange={(e) => handleChange(index, 'jam_buka', e.target.value)}
              disabled={item.is_tutup}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
            />
            <span className="text-gray-400">-</span>
            <input
              type="time"
              value={item.jam_tutup || ''}
              onChange={(e) => handleChange(index, 'jam_tutup', e.target.value)}
              disabled={item.is_tutup}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm disabled:opacity-50"
            />
          </div>
        ))}
      </div>
      <button
        onClick={handleSave}
        disabled={saving}
        className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50"
      >
        {saving ? 'Menyimpan...' : 'Simpan Jam Buka'}
      </button>
    </div>
  );
}
