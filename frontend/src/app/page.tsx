"use client";

import React, { useEffect, useState } from 'react';
import { IngestionArea } from '@/components/ui/IngestionArea';
import { StatusCard, StatusCardSkeleton } from '@/components/ui/StatusCard';
import { useSchemes } from '@/hooks/useSchemes';
import { ChevronRight, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/utils/api';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
  const { data: schemes, isLoading: isLoadingSchemes, error: schemesError } = useSchemes();
  const [userName, setUserName] = useState<string>("");
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { t, isRTL } = useLanguage();

  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE_URL}/users/`);
        if (res.ok) {
          const users = await res.json();
          if (users && users.length > 0) {
            const fullName = users[0].name || users[0].username || '';
            const firstName = fullName.split(' ')[0];
            if (firstName) setUserName(firstName);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
      } finally {
        setIsLoadingUser(false);
      }
    }
    fetchUser();
  }, []);

  return (
    <div className="flex flex-col gap-10 pb-8">
      
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          {isLoadingUser ? (
             <div className="h-8 bg-surface rounded animate-pulse w-64 mb-2"></div>
          ) : (
            <h2 className="text-[28px] font-bold tracking-tight text-text-primary mb-1 flex items-center gap-2">
              {t.welcome_back}{userName ? `, ${userName}` : ''} <span className="text-[28px]">👋</span>
            </h2>
          )}
          <p className="text-text-muted text-[15px] leading-relaxed">{t.ai_assistant_sub}</p>
        </div>
        
        <button 
          onClick={() => router.push('/eligibility')}
          className="btn-primary shrink-0 self-start sm:self-auto shadow-sm"
        >
          <Plus className={`w-[18px] h-[18px] ${isRTL ? 'ml-1.5' : 'mr-1.5'}`} /> {t.new_application}
        </button>
      </div>

      {/* Ingestion Area */}
      <section>
        <IngestionArea />
      </section>

      {/* Popular Schemes Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-text-primary text-[18px]">{t.popular_schemes}</h3>
            <p className="text-[14px] text-text-muted mt-1 leading-relaxed">{t.popular_schemes_sub}</p>
          </div>
          <button onClick={() => router.push('/schemes')} className="text-[14px] font-medium text-brand-accent hover:underline hidden md:flex items-center cursor-pointer">
            {t.view_all_schemes} <ChevronRight className={`w-4 h-4 transition-transform ${isRTL ? 'mr-1 rotate-180' : 'ml-1'}`} />
          </button>
          <button onClick={() => router.push('/schemes')} className="text-[14px] font-medium text-brand-accent hover:underline md:hidden cursor-pointer">
            {t.view_all}
          </button>
        </div>
        
        {schemesError && (
          <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200 text-sm">
            Failed to load schemes. Please make sure the backend is running.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {isLoadingSchemes ? (
            Array.from({ length: 8 }).map((_, i) => <StatusCardSkeleton key={i} />)
          ) : (
            schemes.map((scheme) => (
              <StatusCard 
                key={scheme.id} 
                title={scheme.title} 
                tagline={scheme.tagline} 
                status={scheme.status} 
                iconName={scheme.icon} 
              />
            ))
          )}
        </div>
      </section>

    </div>
  );
}
