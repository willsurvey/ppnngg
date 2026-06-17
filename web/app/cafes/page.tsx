'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import CafeCard from '@/components/cafe/CafeCard';
import CafeFilter from '@/components/cafe/CafeFilter';
import { useCafeList } from '@/hooks/useCafeList';
import { cafeApi } from '@/lib/api/cafeApi';
import type { SearchResult } from '@/types';

export default function CafesPage() {
  const { cafes, pagination, filters, filterOptions, loading, error, setFilter, resetFilters, setPage } = useCafeList();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      try {
        const results = await cafeApi.searchCafes(query);
        setSearchResults(results);
        setShowSearch(true);
      } catch {
        setSearchResults([]);
      }
    } else {
      setShowSearch(false);
      setSearchResults([]);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Ponorogo Cafe</span>
          </Link>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Cari cafe..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            {/* Search dropdown */}
            {showSearch && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-20">
                {searchResults.map((result) => (
                  <Link
                    key={result.id}
                    href={`/cafes/${result.slug}`}
                    className="block px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    onClick={() => setShowSearch(false)}
                  >
                    <p className="font-medium text-sm text-gray-900">{result.nama_cafe}</p>
                    <p className="text-xs text-gray-500">{result.kecamatan} &bull; {result.alamat}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Daftar Cafe</h1>
            <p className="text-sm text-gray-500 mt-1">
              {pagination.total} cafe ditemukan
            </p>
          </div>
          <button
            onClick={() => setShowMobileFilter(!showMobileFilter)}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filter */}
          <aside className={`${showMobileFilter ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
            <CafeFilter
              filters={filters}
              filterOptions={filterOptions}
              onFilterChange={setFilter}
              onReset={resetFilters}
            />
          </aside>

          {/* Cafe Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
                    <div className="h-48 bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-5 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-600">{error}</p>
              </div>
            ) : cafes.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Tidak ada cafe yang sesuai dengan filter</p>
                <button onClick={resetFilters} className="mt-4 text-primary-600 hover:text-primary-800 font-medium">
                  Reset Filter
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {cafes.map((cafe) => (
                    <CafeCard key={cafe.id} cafe={cafe} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.total_pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <button
                      onClick={() => setPage(pagination.page - 1)}
                      disabled={pagination.page <= 1}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setPage(page)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium ${
                          page === pagination.page
                            ? 'bg-primary-600 text-white'
                            : 'border border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(pagination.page + 1)}
                      disabled={pagination.page >= pagination.total_pages}
                      className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
