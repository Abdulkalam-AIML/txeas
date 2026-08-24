'use client';

import React, { useRef, useState } from 'react';
import { Upload, X, Camera, RefreshCw, ZoomIn, CheckCircle2, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { fileService } from '@/services';

interface ImageUploadProps {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  label = 'Item Photo / Appraisal Capture',
  helperText = 'Drag & drop or browse JPG, PNG, WEBP (Max 10MB)',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  const handleFile = async (file: File) => {
    setError(null);
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError('Image size exceeds 10MB limit.');
      return;
    }

    try {
      setIsUploading(true);
      const processed = await fileService.processUploadedFile(file, 'Front');
      onChange(processed.url);
    } catch (err: any) {
      setError(err.message || 'Image upload failed. Try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="space-y-2">
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
            {label}
          </label>
          <span className="text-[10px] text-gray-400">{helperText}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {value ? (
        <div className="bg-[#071320] border border-tgb-gold/40 rounded-2xl p-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div
              onClick={() => setIsZoomOpen(true)}
              className="relative w-16 h-16 rounded-xl overflow-hidden border border-tgb-navyborder cursor-pointer group bg-black"
            >
              <Image src={value} alt="Gold Item" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>
            <div>
              <span className="text-xs font-bold text-white block">Item Photo Attached</span>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5 font-medium">
                <CheckCircle2 className="w-3 h-3" /> Ready for transaction record
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="py-1.5 px-3 bg-tgb-navy hover:bg-tgb-navylight border border-tgb-navyborder text-gray-200 hover:text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" /> Replace
            </button>
            <button
              type="button"
              onClick={() => onChange(null)}
              className="p-2 text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
              title="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-tgb-navyborder hover:border-tgb-gold/60 rounded-2xl p-6 text-center cursor-pointer bg-[#071320]/60 hover:bg-[#071320] transition-all space-y-2 group"
        >
          <div className="w-10 h-10 rounded-full bg-tgb-gold/10 text-tgb-gold group-hover:bg-tgb-gold/20 flex items-center justify-center mx-auto transition-colors">
            {isUploading ? (
              <div className="w-5 h-5 border-2 border-tgb-gold border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Upload className="w-5 h-5" />
            )}
          </div>
          <div className="text-xs text-gray-300 font-semibold">
            {isUploading ? (
              <span className="text-tgb-gold">Uploading Image...</span>
            ) : (
              <>
                Drag & drop gold photo here, or <span className="text-tgb-gold">Browse Files</span>
              </>
            )}
          </div>
          <div className="text-[10px] text-gray-500">
            Assay spectrometer capture, hallmark verification, or counter photo
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Zoom Modal */}
      {isZoomOpen && value && (
        <div
          onClick={() => setIsZoomOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer animate-fade-in"
        >
          <div className="relative max-w-2xl w-full max-h-[80vh] aspect-square rounded-2xl overflow-hidden border border-tgb-gold/50 shadow-2xl">
            <Image src={value} alt="Enlarged Gold Item" fill className="object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
