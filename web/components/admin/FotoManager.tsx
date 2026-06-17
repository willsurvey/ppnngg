'use client';
import { useState, useRef } from 'react';
import { Upload, Trash2, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { adminCafeApi } from '@/lib/api/adminApi';
import type { FotoCafe } from '@/types';

interface FotoManagerProps {
  cafeId: number;
  fotos: FotoCafe[];
  onFotosChange: (fotos: FotoCafe[]) => void;
}

export default function FotoManager({ cafeId, fotos, onFotosChange }: FotoManagerProps) {
  const [uploading, setUploading] = useState(false);
  const [caption, setCaption] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('foto', file);
      formData.append('caption', caption);

      const newFoto = await adminCafeApi.uploadFoto(cafeId, formData);
      onFotosChange([...fotos, newFoto]);
      setCaption('');
      if (fileRef.current) fileRef.current.value = '';
    } catch (error) {
      alert('Gagal upload foto');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (fotoId: number) => {
    if (!confirm('Hapus foto ini?')) return;
    try {
      await adminCafeApi.deleteFoto(fotoId);
      onFotosChange(fotos.filter(f => f.id !== fotoId));
    } catch (error) {
      alert('Gagal hapus foto');
    }
  };

  const moveFoto = async (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= fotos.length) return;

    const newFotos = [...fotos];
    [newFotos[index], newFotos[newIndex]] = [newFotos[newIndex], newFotos[index]];
    onFotosChange(newFotos);

    try {
      const urutan = newFotos.map(f => f.id);
      await adminCafeApi.reorderFotos(cafeId, urutan);
    } catch (error) {
      alert('Gagal mengubah urutan foto');
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-lg text-gray-900 flex items-center gap-2">
        <ImageIcon className="w-5 h-5 text-primary-600" />
        Foto Cafe ({fotos.length} foto)
      </h3>

      {/* Upload Form */}
      <form onSubmit={handleUpload} className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Foto</label>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            required
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:bg-primary-50 file:text-primary-700 file:text-sm file:font-medium"
          />
        </div>
        <div className="w-48">
          <label className="block text-sm font-medium text-gray-700 mb-1">Caption</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Keterangan foto"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button
          type="submit"
          disabled={uploading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium disabled:opacity-50"
        >
          <Upload className="w-4 h-4" />
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>

      {/* Photo Grid */}
      {fotos.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <ImageIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
          <p className="text-sm text-gray-500">Belum ada foto. Upload foto pertama!</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {fotos.map((foto, index) => (
            <div key={foto.id} className="relative group bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="aspect-square bg-gray-100">
                <img
                  src={foto.url_foto}
                  alt={foto.caption || `Foto ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>

              {foto.caption && (
                <p className="text-xs text-gray-600 px-2 py-1 truncate">{foto.caption}</p>
              )}

              <div className="absolute top-2 left-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded">
                #{index + 1}
              </div>

              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                {index > 0 && (
                  <button
                    onClick={() => moveFoto(index, 'up')}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Geser ke atas"
                  >
                    <ChevronUp className="w-4 h-4" />
                  </button>
                )}
                {index < fotos.length - 1 && (
                  <button
                    onClick={() => moveFoto(index, 'down')}
                    className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                    title="Geser ke bawah"
                  >
                    <ChevronDown className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(foto.id)}
                  className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600"
                  title="Hapus foto"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-xs text-gray-400">
        * Hover foto untuk melihat tombol hapus dan ubah urutan. Foto pertama akan jadi thumbnail.
      </p>
    </div>
  );
}
