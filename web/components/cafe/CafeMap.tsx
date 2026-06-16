'use client';
import { MapPin, ExternalLink } from 'lucide-react';

interface CafeMapProps {
  latitude: number;
  longitude: number;
  cafeName: string;
  googleMapsUrl?: string;
}

export default function CafeMap({ latitude, longitude, cafeName, googleMapsUrl }: CafeMapProps) {
  const embedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;
  const mapsLink = googleMapsUrl || `https://maps.google.com/?q=${latitude},${longitude}`;

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
        <MapPin className="w-5 h-5 text-primary-600" />
        Lokasi
      </h3>

      {/* Google Maps Embed */}
      <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden border border-gray-200">
        <iframe
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Peta lokasi ${cafeName}`}
        />
      </div>

      {/* Open in Maps button */}
      <a
        href={mapsLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
      >
        <ExternalLink className="w-4 h-4" />
        Buka di Google Maps
      </a>
    </div>
  );
}
