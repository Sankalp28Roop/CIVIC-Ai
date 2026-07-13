"use client";

import React, { useState, useRef, useEffect } from 'react';
import { LayoutDashboard, FileText, BookmarkCheck, Activity, Bell, Bookmark, HelpCircle, Settings, ChevronDown, CheckSquare, LogOut, User as UserIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useFetchData } from '@/hooks/useFetchData';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'My Documents', href: '/documents', icon: FileText },
  { name: 'Schemes', href: '/schemes', icon: BookmarkCheck },
  { name: 'Eligibility Check', href: '/eligibility', icon: CheckSquare },
  { name: 'Applications', href: '/applications', icon: Activity },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Saved', href: '/saved', icon: Bookmark },
  { name: 'Help & Support', href: '/support', icon: HelpCircle },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface UserProfile {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

export function Sidebar({ isOpen, close }: { isOpen: boolean, close: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  
  const { data: profile, isLoading } = useFetchData<UserProfile>('/users/me/profile');
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if clicked outside
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
    // Clear local token logic here (mocked for now)
    localStorage.removeItem('auth_token');
    sessionStorage.clear();
    // Redirect to public auth screen (mock route)
    router.push('/login');
  };

  return (
    <>
      {/* Mobile/Tablet Overlay Drawer */}
      <div 
        className={`fixed inset-0 bg-black/20 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={close}
      />
      
      <aside className={`fixed lg:static top-0 bottom-0 left-0 z-50 w-[240px] bg-canvas border-r border-border-subtle shrink-0 transform transition-transform duration-200 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <nav className="flex-1 py-4 flex flex-col gap-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
            const Icon = item.icon;
            
            const isBottomGroup = item.name === 'Help & Support';
            
            return (
              <React.Fragment key={item.name}>
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
                    <div className="absolute left-[-12px] top-[10%] bottom-[10%] w-[4px] bg-brand-accent rounded-r-md" />
                  )}
                  <Icon className={`w-[18px] h-[18px] shrink-0 ${isActive ? 'text-brand-accent' : ''}`} strokeWidth={isActive ? 2.5 : 2} />
                  <span className="text-[14px]">{item.name}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </nav>

        {/* Profile Card at bottom */}
        <div className="p-4 border-t border-border-subtle bg-canvas relative" ref={dropdownRef}>
          {/* Overlay Dropdown */}
          {isDropdownOpen && (
            <div className="absolute bottom-full left-4 right-4 mb-2 bg-surface border border-border-subtle rounded-xl shadow-lg z-50 overflow-hidden animate-in slide-in-from-bottom-2 fade-in duration-200">
              <div className="flex flex-col py-1">
                <Link 
                  href="/settings" 
                  onClick={() => setIsDropdownOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-text-primary hover:bg-canvas transition-colors"
                >
                  <UserIcon className="w-4 h-4 text-text-muted" />
                  View Profile
                </Link>
                <div className="h-px bg-border-subtle my-1 w-full" />
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-2.5 text-[13px] text-error hover:bg-error/10 transition-colors text-left w-full"
                >
                  <LogOut className="w-4 h-4 text-error" />
                  Log Out
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
               <div className="w-4 h-4 bg-canvas rounded animate-pulse shrink-0 mr-1" />
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
              <ChevronDown className={`w-4 h-4 text-text-muted shrink-0 mr-1 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
