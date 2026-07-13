"use client";

import React, { useState, useRef } from 'react';
import { FileText, Upload, Loader2, CheckCircle2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/utils/api';

export function IngestionArea() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const validateFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|jpg|jpeg|png)$/i)) {
      return "Invalid file type. Only PDF, JPG, PNG are supported.";
    }
    if (file.size > 10 * 1024 * 1024) {
      return "File size exceeds 10MB limit.";
    }
    return null;
  };

  const uploadFile = async (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsUploading(true);
    setError(null);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch(`${API_BASE_URL}/documents/analyze-doc`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Failed to upload document");
      }

      setUploadSuccess(true);
      
      // Transition smoothly after success
      setTimeout(() => {
        router.push('/documents');
      }, 1500);
      
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred during upload.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      uploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      uploadFile(e.target.files[0]);
    }
  };

  return (
    <>
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".pdf,.png,.jpg,.jpeg" 
      />

      {/* Desktop & Tablet Dropzone */}
      <div 
        className={`hidden md:flex w-full items-center justify-between py-8 px-10 rounded-xl border border-dashed transition-all cursor-pointer group relative overflow-hidden ${
          isDragging 
            ? 'bg-blue-50/50 border-brand-accent dark:bg-brand-accent/10' 
            : 'bg-surface border-border-subtle hover:bg-canvas'
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
            <h3 className="text-text-primary font-semibold text-[17px] mb-1">
              {uploadSuccess ? 'Document Parsing Initiated' : isUploading ? 'Analyzing Document with AI...' : 'Upload documents to get started'}
            </h3>
            <p className="text-text-muted text-[14px]">
              {uploadSuccess ? (
                'Redirecting to your audits...'
              ) : isUploading ? (
                <span className="text-brand-accent animate-pulse">Extracting metadata and verifying structure</span>
              ) : (
                <>
                  Drag & drop your documents here or click to browse <br/>
                  <span className="text-[13px] opacity-80 mt-1 block">PDF, JPG, PNG up to 10MB each</span>
                </>
              )}
            </p>
            {error && <p className="text-error text-[13px] mt-2 font-medium">{error}</p>}
          </div>
        </div>

        <button 
          className={`btn-secondary text-[14px] px-5 py-2.5 h-[42px] font-medium shadow-sm bg-surface transition-opacity ${
            isUploading || uploadSuccess ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          <Upload className="w-4 h-4 mr-2" strokeWidth={2} /> Browse Files
        </button>

        {isUploading && (
          <div className="absolute bottom-0 left-0 h-1 bg-brand-accent transition-all duration-300 w-full animate-pulse" />
        )}
      </div>

      {/* Mobile Tap-to-browse */}
      <button 
        onClick={() => !isUploading && !uploadSuccess && fileInputRef.current?.click()}
        className="md:hidden w-full btn-secondary min-h-[64px] justify-between border-dashed border-[#A1A1AA] hover:bg-canvas bg-surface px-4 relative overflow-hidden"
      >
        <span className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center border border-blue-100 shrink-0">
             {isUploading ? <Loader2 className="w-5 h-5 text-brand-accent animate-spin" strokeWidth={1.5} /> : uploadSuccess ? <CheckCircle2 className="w-5 h-5 text-green-600" /> : <FileText className="w-5 h-5 text-brand-accent" strokeWidth={1.5} />}
          </div>
          <span className="font-semibold text-[15px] text-text-primary flex flex-col items-start">
             <span>{uploadSuccess ? 'Document Queued' : isUploading ? 'Analyzing...' : 'Upload documents'}</span>
             {error && <span className="text-error text-[11px] mt-0.5">{error}</span>}
          </span>
        </span>
        <span className="text-[12px] text-text-muted">{isUploading ? 'Processing' : 'Tap to browse'}</span>
        {isUploading && <div className="absolute bottom-0 left-0 h-[2px] bg-brand-accent w-full animate-pulse" />}
      </button>
    </>
  );
}
