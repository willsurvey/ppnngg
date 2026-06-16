'use client';
import { useEffect } from 'react';
import { Coffee, CheckCircle, AlertTriangle, BarChart3 } from 'lucide-react';
import { useAdminStore } from '@/store/useAdminStore';

export default function AdminDashboardPage() {
  const { stats, loading, fetchStats } = useAdminStore();

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<Coffee className="w-6 h-6 text-blue-600" />}
          label="Total Cafe"
          value={stats.total_cafe}
          bgColor="bg-blue-50"
        />
        <StatCard
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
          label="Cafe Aktif"
          value={stats.cafe_aktif}
          bgColor="bg-green-50"
        />
        <StatCard
          icon={<AlertTriangle className="w-6 h-6 text-yellow-600" />}
          label="Belum Lengkap"
          value={stats.cafe_tidak_lengkap}
          bgColor="bg-yellow-50"
        />
        <StatCard
          icon={<BarChart3 className="w-6 h-6 text-primary-600" />}
          label="Rata-rata Kelengkapan"
          value={`${stats.rata_rata_completeness}%`}
          bgColor="bg-primary-50"
        />
      </div>

      {/* Cafe per Kecamatan */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Cafe per Kecamatan</h2>
        <div className="space-y-3">
          {stats.cafe_per_kecamatan.map((item) => (
            <div key={item.kecamatan} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{item.kecamatan}</span>
              <div className="flex items-center gap-3">
                <div className="w-32 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary-500 rounded-full"
                    style={{ width: `${Math.min((item.total / stats.cafe_aktif) * 100, 100)}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900 w-8 text-right">{item.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, bgColor }: { icon: React.ReactNode; label: string; value: number | string; bgColor: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${bgColor} mb-3`}>
        {icon}
      </div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
    </div>
  );
}
