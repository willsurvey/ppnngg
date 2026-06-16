'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { FotoCafe } from '@/types';

interface CafeCarouselProps {
  fotos: FotoCafe[];
  cafeName: string;
}

export default function CafeCarousel({ fotos, cafeName }: CafeCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!fotos || fotos.length === 0) {
    return (
      <div className="w-full h-64 md:h-96 bg-gray-200 rounded-xl flex items-center justify-center">
        <p className="text-gray-400">Belum ada foto</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="relative w-full h-64 md:h-96 rounded-xl overflow-hidden group">
      <img
        src={fotos[currentIndex].url_foto}
        alt={`${cafeName} - ${fotos[currentIndex].caption || 'Foto ' + (currentIndex + 1)}`}
        className="w-full h-full object-cover"
      />

      {/* Caption */}
      {fotos[currentIndex].caption && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <p className="text-white text-sm">{fotos[currentIndex].caption}</p>
        </div>
      )}

      {/* Navigation arrows */}
      {fotos.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Dot indicators */}
      {fotos.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {fotos.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex ? 'bg-white w-6' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      )}

      {/* Counter */}
      <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded">
        {currentIndex + 1} / {fotos.length}
      </div>
    </div>
  );
}
