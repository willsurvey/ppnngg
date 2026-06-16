'use client';
import { useState, useEffect } from 'react';
import { cafeApi } from '@/lib/api/cafeApi';
import type { CafeDetail } from '@/types';

export function useCafeDetail(slug: string) {
  const [cafe, setCafe] = useState<CafeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await cafeApi.getCafeBySlug(slug);
        setCafe(data);
      } catch (err) {
        setError('Gagal memuat detail cafe');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [slug]);

  return { cafe, loading, error };
}
