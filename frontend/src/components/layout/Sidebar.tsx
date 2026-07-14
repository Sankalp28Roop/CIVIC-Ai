"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, FileText, BookmarkCheck, Activity, Bell, Bookmark, HelpCircle, Settings, ChevronDown, CheckSquare, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useFetchData } from '@/hooks/useFetchData';
import { useLanguage } from '@/context/LanguageContext';

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export function Sidebar({ isOpen, close }: { isOpen: boolean, close: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { t, isRTL } = useLanguage();
  
  const { data: profile, isLoading } = useFetchData<UserProfile>('/users/me/profile');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: t.nav_dashboard, href: '/', icon: LayoutDashboard, rawName: 'Dashboard' },
    { name: t.nav_documents, href: '/documents', icon: FileText, rawName: 'My Documents' },
    { name: t.nav_schemes, href: '/schemes', icon: BookmarkCheck, rawName: 'Schemes' },
    { name: t.nav_eligibility, href: '/eligibility', icon: CheckSquare, rawName: 'Eligibility Check' },
    { name: t.nav_applications, href: '/applications', icon: Activity, rawName: 'Applications' },
    { name: t.nav_notifications, href: '/notifications', icon: Bell, rawName: 'Notifications' },
    { name: t.nav_saved, href: '/saved', icon: Bookmark, rawName: 'Saved' },
    { name: t.nav_support, href: '/support', icon: HelpCircle, rawName: 'Help & Support' },
    { name: t.nav_settings, href: '/settings', icon: Settings, rawName: 'Settings' },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    sessionStorage.clear();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile/Tablet Overlay Drawer */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
      />
      
      <aside className={`fixed lg:static top-0 bottom-0 z-50 w-[240px] bg-canvas shrink-0 transform transition-transform duration-200 ease-in-out flex flex-col ${
        isRTL ? 'right-0 border-l border-border-subtle' : 'left-0 border-r border-border-subtle'
      } ${
        isOpen ? 'translate-x-0' : isRTL ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            const Icon = item.icon;
            
            const isBottomGroup = item.rawName === 'Help & Support';
            
            return (
              <React.Fragment key={item.rawName}>
                {isBottomGroup && <div className="mt-4 mb-2 border-t border-border-subtle mx-4" />}
                <Link 
                  href={item.href}
                  onClick={() => { if(window.innerWidth < 1024) close() }}
                  className={`relative flex items-center gap-3 px-6 py-2 transition-colors min-h-[44px] mx-3 rounded-md ${
                    isActive 
                      ? 'bg-blue-50 text-brand-accent font-medium dark:bg-brand-accent/10' 
                      : 'text-text-muted font-normal hover:text-text-primary hover:bg-surface/50'
                  }`}
                >
                  {isActive && (
                    <div className={`absolute top-[10%] bottom-[10%] w-[4px] bg-brand-accent ${
                      isRTL ? 'right-[-12px] rounded-l-md' : 'left-[-12px] rounded-r-md'
                    }`} />
                  )}
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-brand-accent' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[14px] leading-snug">{item.name}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Profile Card at bottom */}
        <div className="p-4 border-t border-border-subtle bg-canvas relative" ref={dropdownRef}>
          {/* Overlay Dropdown */}
          {isDropdownOpen && (
            <div className={`absolute bottom-full mb-2 bg-surface border border-border-subtle rounded-xl shadow-lg z-50 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200 ${
              isRTL ? 'left-4 right-4' : 'left-4 right-4'
            }`}>
              <div className="flex flex-col py-1">
                <Link 
                  href="/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-text-primary hover:bg-canvas transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-text-muted shrink-0" />
                  {t.view_profile}
                </Link>
                <div className="h-px bg-border-subtle my-1 w-full" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-error hover:bg-error/10 transition-colors text-left w-full"
                >
                  <LogOut className="w-4 h-4 text-error shrink-0" />
                  {t.log_out}
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
             <div className="flex items-center gap-3 p-2 bg-surface border border-border-subtle rounded-lg shadow-sm">
               <div className="w-9 h-9 bg-canvas border border-border-subtle rounded-full animate-pulse shrink-0" />
               <div className="flex-1 flex flex-col gap-2 min-w-0 py-1">
                 <div className="h-3.5 bg-canvas rounded animate-pulse w-3/4" />
                 <div className="h-2.5 bg-canvas rounded animate-pulse w-full" />
               </div>
               <div className="w-4 h-4 bg-canvas rounded animate-pulse shrink-0" />
             </div>
          ) : (
            <div 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 p-2 bg-surface border border-border-subtle rounded-lg cursor-pointer hover:bg-canvas transition-colors shadow-sm"
            >
              <div className="w-9 h-9 bg-brand-accent/10 rounded-full flex items-center justify-center shrink-0 text-brand-accent font-bold text-[14px]">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[13px] font-semibold text-text-primary truncate leading-tight mb-0.5">{profile?.full_name || 'Unknown User'}</h4>
                <p className="text-[11px] text-text-muted truncate leading-tight">{profile?.email || 'No email provided'}</p>
              </div>
              <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
