'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import CafeForm from '@/components/admin/CafeForm';
import { adminCafeApi } from '@/lib/api/adminApi';
import type { CreateCafeRequest } from '@/types';

export default function AdminNewCafePage() {
  const router = useRouter();

  const handleSubmit = async (data: CreateCafeRequest) => {
    await adminCafeApi.createCafe(data);
    router.push('/admin/cafes');
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/cafes" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm w-fit">
          <ArrowLeft className="w-4 h-4" />
          Kembali
        </Link>
        <h1 className="text-2xl font-bold text-gray-900 mt-2">Tambah Cafe Baru</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <CafeForm onSubmit={handleSubmit} submitLabel="Simpan Cafe" />
      </div>
    </div>
  );
}
