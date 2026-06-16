'use client';
import { useEffect } from 'react';
import { useCafeStore } from '@/store/useCafeStore';

export function useCafeList() {
  const { cafes, pagination, filters, filterOptions, loading, error, fetchCafes, fetchFilterOptions, setFilter, resetFilters, setPage } = useCafeStore();

  useEffect(() => {
    fetchCafes();
    fetchFilterOptions();
  }, []);

  return {
    cafes,
    pagination,
    filters,
    filterOptions,
    loading,
    error,
    setFilter,
    resetFilters,
    setPage,
    refetch: () => fetchCafes(),
  };
}
