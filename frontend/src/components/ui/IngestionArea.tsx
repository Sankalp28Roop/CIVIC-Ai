"use client";

import React, { useState, useRef } from 'react';
import { FileText, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/utils/api';
import { useLanguage } from '@/context/LanguageContext';

export function IngestionArea() {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const { t, isRTL, isHindi, isUrdu } = useLanguage();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await uploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await uploadFile(e.dataTransfer.files[0]);
    }
  };

  const uploadFile = async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/documents/upload/`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        throw new Error('Upload failed. Please check backend configuration.');
      }

      const data = await res.json();
      setUploadSuccess(true);
      
      setTimeout(() => {
        if (data.id) {
          router.push(`/documents/${data.id}`);
        } else {
          router.push('/documents');
        }
      }, 1000);

    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred during document ingestion.');
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full">
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept=".pdf,.doc,.docx,.jpg,.png"
      />

      {/* Desktop / Tablet Drag & Drop Card */}
      <div 
        className={`hidden md:flex items-center justify-between border-dashed rounded-2xl p-6 bg-surface transition-all cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md ${
          isUploading ? 'border-brand-accent bg-blue-50/20 dark:bg-brand-accent/5' : uploadSuccess ? 'border-green-500 bg-green-50/30' : 'border-[#A1A1AA] hover:border-brand-accent'
        }`}
        style={{ borderWidth: '1.5px' }}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isUploading && !uploadSuccess && fileInputRef.current?.click()}
      >
        <div className="flex items-center gap-6 relative z-10">
          <div className={`w-[52px] h-[52px] rounded-[14px] flex items-center justify-center shrink-0 border transition-colors ${
            uploadSuccess ? 'bg-green-50 border-green-200 text-green-600' : 'bg-blue-50 border-blue-100 text-brand-accent dark:bg-brand-accent/20 dark:border-brand-accent/30'
          }`}>
            {uploadSuccess ? (
              <CheckCircle2 className="w-7 h-7" strokeWidth={1.5} />
            ) : isUploading ? (
              <Loader2 className="w-7 h-7 animate-spin" strokeWidth={1.5} />
            ) : (
              <FileText className="w-7 h-7" strokeWidth={1.5} />
            )}
          </div>
          <div>
            <h3 className="text-text-primary font-semibold text-[17px] mb-1 leading-snug">
              {uploadSuccess ? t.upload_title_success : isUploading ? t.upload_title_uploading : t.upload_title_default}
            </h3>
            <p className="text-text-muted text-[14px] leading-relaxed">
              {uploadSuccess ? (
                isUrdu ? 'آپ کی دستاویزات کی طرف منتقل کیا جا رہا ہے...' : isHindi ? 'आपके दस्तावेज़ों पर पुनर्निर्देशित किया जा रहा है...' : 'Redirecting to your audits...'
              ) : isUploading ? (
                <span className="text-brand-accent animate-pulse">
                  {isUrdu ? 'میٹاشیٹا نکالا جا رہا ہے اور ساخت کی تصدیق ہو رہی ہے...' : isHindi ? 'मेटाडेटा निकाला जा रहा है और संरचना की जांच हो रही है...' : 'Extracting metadata and verifying structure'}
                </span>
              ) : (
                <>
                  {t.upload_sub_default} <br/>
                  <span className="text-[13px] opacity-80 mt-1 block">{t.upload_sub_limit}</span>
                </>
              )}
            </p>
            {error && <p className="text-error text-[13px] mt-2 font-medium">{error}</p>}
          </div>
        </div>

        <button 
          className={`btn-secondary text-[14px] px-5 py-2.5 h-[42px] font-medium shadow-sm bg-surface transition-opacity shrink-0 ${
            isUploading || uploadSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Upload className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} strokeWidth={2} /> {t.browse_files}
        </button>

        {isUploading && (
          <div className="absolute bottom-0 left-0 h-1 bg-brand-accent transition-all duration-300 w-full animate-pulse" />
        )}
      </div>

      {/* Mobile Tap-to-browse */}
      <button 
        onClick={() => !isUploading && !uploadSuccess && fileInputRef.current?.click()}
        className="md:hidden w-full btn-secondary min-h-[64px] justify-between border-dashed border-[#A1A1AA] hover:bg-canvas bg-surface px-4 relative overflow-hidden shadow-sm"
      >
        <span className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 shrink-0">
             {isUploading ? <Loader2 className="w-5 h-5 text-brand-accent animate-spin" strokeWidth={1.5} /> : uploadSuccess ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />}
          </div>
          <span className="text-left font-medium text-[15px] leading-tight">
            {uploadSuccess ? t.upload_title_success : isUploading ? t.upload_title_uploading : t.upload_title_default}
            <span className="block text-[12px] text-text-muted font-normal mt-0.5">{t.upload_sub_limit}</span>
          </span>
        </span>
        <Upload className="w-5 h-5 text-text-muted shrink-0" strokeWidth={1.8} />
      </button>

    </div>
  );
}
