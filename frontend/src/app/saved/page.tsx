"use client";

import React from 'react';
import { useFetchData } from '@/hooks/useFetchData';
import { Bookmark, FileText, ChevronRight } from 'lucide-react';

interface SavedItem {
  type: string;
  title: string;
  description: string;
  link: string;
}

export default function SavedPage() {
  const { data, isLoading, error } = useFetchData<SavedItem[]>('/saved/');

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[24px] font-bold text-text-primary">Saved Items</h2>
        <p className="text-text-muted text-[14px] mt-1">Your bookmarked schemes and document summaries.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface rounded-2xl p-6 border border-border-subtle shadow-sm flex flex-col h-40">
              <div className="w-8 h-8 rounded-full bg-canvas animate-pulse mb-3"></div>
              <div className="h-4 bg-canvas rounded animate-pulse w-3/4 mb-2"></div>
              <div className="h-3 bg-canvas rounded animate-pulse w-1/2"></div>
            </div>
          ))
        ) : error ? (
          <div className="col-span-full p-4 bg-red-50 text-red-600 rounded-md border border-red-200">Failed to load saved items.</div>
        ) : data && data.length > 0 ? (
          data.map((item: SavedItem, i: number) => (
            <div key={i} className="bg-surface rounded-2xl p-6 border border-border-subtle shadow-sm flex flex-col hover:shadow-md transition-shadow relative overflow-hidden group">
              <div className="absolute top-4 right-4 text-brand-accent opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                 <Bookmark className="w-5 h-5 fill-brand-accent" />
              </div>
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 text-brand-accent">
                   {item.type === 'Scheme' ? <Bookmark className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-text-muted">{item.type}</span>
                  <h3 className="font-semibold text-text-primary text-[16px] leading-tight mt-0.5">{item.title}</h3>
                </div>
              </div>
              <p className="text-text-muted text-[13px] mb-4">{item.description}</p>
              <div className="mt-auto pt-4 border-t border-border-subtle flex items-center">
                <button className="text-[13px] font-medium text-brand-accent hover:underline flex items-center">
                  View Resource <ChevronRight className="w-4 h-4 ml-0.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-text-muted">No saved items found.</div>
        )}
      </div>
    </div>
  );
}
