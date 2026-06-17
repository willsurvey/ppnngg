'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';
import { formatRupiahShort } from '@/lib/utils/formatRupiah';

export default function AdminCafesPage() {
  const { cafes, loading, deleteCafe, fetchCafes } = useAdminStore();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCafes();
  }, []);

  const filteredCafes = cafes.filter(
    (c) => c.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.kecamatan?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: number, nama: string) => {
    if (confirm(`Yakin ingin menghapus "${nama}"?`)) {
      const success = await deleteCafe(id);
      if (success) {
        fetchCafes();
      }
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelola Cafe</h1>
        <Link
          href="/admin/cafes/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Tambah Cafe
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Cari cafe berdasarkan nama atau kecamatan..."
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 animate-pulse">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-12 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kecamatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Harga</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kelengkapan</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCafes.map((cafe) => (
                <tr key={cafe.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{cafe.nama}</p>
                    <p className="text-xs text-gray-500">{cafe.slug}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">{cafe.kecamatan || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatRupiahShort(cafe.harga_min || 0)} - {formatRupiahShort(cafe.harga_max || 0)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            cafe.completeness_pct >= 80 ? 'bg-green-500' :
                            cafe.completeness_pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                          }`}
                          style={{ width: `${cafe.completeness_pct}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-500">{cafe.completeness_pct}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/cafes/${cafe.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(cafe.id, cafe.nama)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredCafes.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada cafe ditemukan
            </div>
          )}
        </div>
      )}
    </div>
  );
}
