"use client";

import React from 'react';
import { useFetchData } from '@/hooks/useFetchData';
import { FileText, MoreVertical, Upload } from 'lucide-react';

interface Document {
  id: string;
  name: string;
  uploadDate: string;
  size: string;
  badge: 'Extracted' | 'Processing' | 'Failed';
}

export default function DocumentsPage() {
  const { data, isLoading, error } = useFetchData<Document[]>('/documents/');

  const getBadgeStyle = (badge: string) => {
    switch(badge) {
      case 'Extracted': return 'bg-green-50 text-green-700 border-green-200';
      case 'Processing': return 'bg-blue-50 text-brand-accent border-blue-200';
      case 'Failed': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-text-primary">My Documents</h2>
          <p className="text-text-muted text-[14px] mt-1">Manage and track the AI processing status of your uploaded files.</p>
        </div>
        <button className="btn-primary shadow-sm hidden sm:flex">
          <Upload className="w-4 h-4 mr-2" /> Upload Document
        </button>
      </div>

      <div className="bg-surface rounded-xl border border-border-subtle overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-canvas/50">
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider">Document Name</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider">Upload Date</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider">File Size</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider">AI Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i} className="border-b border-border-subtle last:border-0">
                    <td className="px-6 py-4"><div className="h-4 bg-canvas rounded animate-pulse w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-canvas rounded animate-pulse w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-canvas rounded animate-pulse w-16"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-canvas rounded animate-pulse w-20"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : error ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-red-500">Failed to load documents.</td></tr>
              ) : data && data.length > 0 ? (
                data.map((doc: Document, i: number) => (
                  <tr key={i} className="border-b border-border-subtle last:border-0 hover:bg-canvas/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100">
                           <FileText className="w-4 h-4 text-brand-accent" />
                        </div>
                        <span className="font-medium text-text-primary text-[14px]">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[14px] text-text-muted">{new Date(doc.uploadDate).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-[14px] text-text-muted">{doc.size}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium border ${getBadgeStyle(doc.badge)}`}>
                        {doc.badge}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-text-muted hover:bg-canvas rounded-md transition-colors"><MoreVertical className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No documents uploaded yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
