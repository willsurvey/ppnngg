'use client';
import { useEffect } from 'react';
import { useAdminStore } from '@/store/useAdminStore';

export function useAdminCafe() {
  const { stats, cafes, loading, error, fetchStats, fetchCafes, deleteCafe } = useAdminStore();

  useEffect(() => {
    fetchStats();
    fetchCafes();
  }, []);

  return {
    stats,
    cafes,
    loading,
    error,
    refreshStats: () => fetchStats(),
    refreshCafes: () => fetchCafes(),
    deleteCafe,
  };
}
