import Link from 'next/link';
import { Coffee, Search, MapPin, Filter } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-800 via-primary-700 to-primary-900 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-6xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Temukan Cafe Terbaik di <span className="text-primary-200">Ponorogo</span>
            </h1>
            <p className="mt-4 text-lg text-primary-100">
              Jelajahi direktori cafe terlengkap di Ponorogo. Filter berdasarkan lokasi,
              fasilitas, harga, dan suasana untuk menemukan tempat nongkrong favoritmu.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/cafes"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-primary-800 rounded-lg font-semibold hover:bg-primary-50 transition-colors"
              >
                <Search className="w-5 h-5" />
                Jelajahi Cafe
              </Link>
              <a
                href="#fitur"
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-colors"
              >
                Pelajari Lebih Lanjut
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="fitur" className="max-w-6xl mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Kenapa Pakai Ponorogo Cafe?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Coffee className="w-8 h-8 text-primary-600" />}
            title="Direktori Lengkap"
            description="Data cafe di seluruh kecamatan Ponorogo dengan informasi detail: harga, jam buka, fasilitas, dan suasana."
          />
          <FeatureCard
            icon={<Filter className="w-8 h-8 text-primary-600" />}
            title="Filter Cerdas"
            description="Filter cafe berdasarkan 11 kriteria: kecamatan, harga, WiFi, AC, mushola, parkir, suasana, dan lainnya."
          />
          <FeatureCard
            icon={<MapPin className="w-8 h-8 text-primary-600" />}
            title="Peta Interaktif"
            description="Lihat lokasi cafe di peta dan temukan cafe terdekat dari posisimu dengan Google Maps."
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            Siap Menemukan Cafe Impianmu?
          </h2>
          <p className="mt-4 text-gray-600">
            Mulai jelajahi sekarang dan temukan tempat nongkrong terbaik di Ponorogo.
          </p>
          <Link
            href="/cafes"
            className="mt-8 inline-flex items-center gap-2 px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
          >
            <Search className="w-5 h-5" />
            Mulai Jelajahi
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm">
            &copy; 2025 Ponorogo Cafe. Proyek Akhir D3 PJJ Teknik Informatika &mdash; PENS.
          </p>
          <p className="text-xs mt-1">
            Wildan Khoiru Rijal Nur Wahid &mdash; NRP 3124510106
          </p>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
      <p className="mt-2 text-sm text-gray-600">{description}</p>
    </div>
  );
}
