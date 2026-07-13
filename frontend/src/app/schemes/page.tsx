"use client";

import React from 'react';
import { useFetchData } from '@/hooks/useFetchData';
import { Search, ChevronRight } from 'lucide-react';
import { StatusCardSkeleton } from '@/components/ui/StatusCard';
import * as LucideIcons from 'lucide-react';

interface Scheme {
  id: string;
  title: string;
  tagline: string;
  status: string;
  icon: string;
}

export default function SchemesPage() {
  const { data, isLoading, error } = useFetchData<Scheme[]>('/schemes/');

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-text-primary">Available Schemes</h2>
          <p className="text-text-muted text-[14px] mt-1">Browse the comprehensive catalog of public welfare programs.</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search schemes..." 
            className="w-full bg-surface border border-border-subtle rounded-md pl-9 pr-4 py-2 text-[14px] text-text-primary outline-none focus-visible:ring-1 focus-visible:ring-brand-accent focus-visible:border-brand-accent shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <StatusCardSkeleton key={i} />)
        ) : error ? (
          <div className="col-span-full p-4 bg-red-50 text-red-600 rounded-md border border-red-200">Failed to load schemes</div>
        ) : data ? (
          data.map((scheme: Scheme, i: number) => {
            const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[
              String(scheme.icon).split('-').map((p:string) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
            ] || LucideIcons.FileText;

            return (
              <div key={i} className="bg-surface rounded-2xl p-6 border border-border-subtle shadow-sm flex flex-col hover:shadow-md transition-shadow">
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 text-brand-accent">
                     <IconComponent className="w-6 h-6" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-[16px] leading-tight mb-1">{scheme.title}</h3>
                    <p className="text-text-muted text-[13px]">{scheme.tagline}</p>
                  </div>
                </div>
                <div className="mt-auto pt-4 border-t border-border-subtle flex items-center justify-between">
                  <span className="text-[12px] font-medium px-2.5 py-1 bg-canvas rounded-md text-text-muted">
                    {scheme.status === 'Active' ? 'Accepting Applications' : 'Closed'}
                  </span>
                  <button className="text-[13px] font-medium text-brand-accent hover:underline flex items-center">
                    Check Details <ChevronRight className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            );
          })
        ) : null}
      </div>
    </div>
  );
}
