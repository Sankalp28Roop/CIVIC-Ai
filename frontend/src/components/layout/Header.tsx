"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, Accessibility, Eye } from 'lucide-react';
import { useFetchData } from '@/hooks/useFetchData';
import { useTheme } from '@/context/ThemeContext';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
}

// Helper to format ISO strings to relative time
function timeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + " years ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + " months ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + " days ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + " hours ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + " mins ago";
  return "just now";
}

export function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
  const { data: notifications, isLoading: isLoadingNotifs } = useFetchData<Notification[]>('/notifications/');
  const { font_size, high_contrast, updatePreferences } = useTheme();
  
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isAccessOpen, setIsAccessOpen] = useState(false);
  
  const notifRef = useRef<HTMLDivElement>(null);
  const accessRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotifOpen(false);
      }
      if (accessRef.current && !accessRef.current.contains(event.target as Node)) {
        setIsAccessOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications ? notifications.filter(n => !n.isRead).length : 0;

  const handleFontSizeChange = (size: string) => {
    updatePreferences({ font_size: size });
    // Simulate API call persistence
    fetch('http://localhost:8000/users/me/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ font_size: size })
    }).catch(console.error);
  };

  const handleHighContrastToggle = () => {
    const newValue = !high_contrast;
    updatePreferences({ high_contrast: newValue });
    // Simulate API call persistence
    fetch('http://localhost:8000/users/me/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ high_contrast: newValue })
    }).catch(console.error);
  };

  return (
    <header className="h-16 bg-surface border-b border-border-subtle flex items-center justify-between px-4 md:px-8 shrink-0 z-50">
      
      {/* Mobile: Hamburger & Absolute Center Logo */}
      <div className="flex lg:hidden items-center">
        <button onClick={toggleSidebar} className="p-2 -ml-2 text-text-primary hover:bg-canvas rounded-md min-h-[44px] min-w-[44px] flex items-center justify-center">
          <Menu className="w-5 h-5" />
        </button>
      </div>
      
      {/* Logo Area */}
      <div className="absolute left-1/2 -translate-x-1/2 lg:static lg:translate-x-0 flex items-center lg:w-[208px]">
        <h1 className="font-bold text-lg tracking-tight font-sans text-brand-accent">Civic-AI</h1>
      </div>

      {/* Desktop/Tablet Global Search */}
      <div className="hidden md:flex flex-1 max-w-xl mx-6 lg:mx-0">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search schemes, documents, services..." 
            className="w-full bg-surface border border-border-subtle rounded-md pl-9 pr-4 py-2 text-sm text-text-primary outline-none focus-visible:ring-1 focus-visible:ring-brand-accent focus-visible:border-brand-accent transition-shadow shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2 lg:gap-4 ml-auto">
        
        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button 
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 text-text-muted hover:bg-canvas rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <Bell className="w-5 h-5" />
            {!isLoadingNotifs && unreadCount > 0 && (
              <div className="absolute top-1.5 right-2 w-4 h-4 bg-brand-accent rounded-full border-2 border-surface flex items-center justify-center text-[9px] text-white font-bold">
                {unreadCount}
              </div>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute top-full right-0 mt-2 w-80 bg-surface border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <span className="text-xs text-brand-accent cursor-pointer hover:underline">Mark all read</span>
              </div>
              <div className="max-h-[320px] overflow-y-auto flex flex-col">
                {isLoadingNotifs ? (
                  <div className="p-4 flex flex-col gap-3">
                    <div className="h-4 bg-canvas rounded animate-pulse w-3/4"></div>
                    <div className="h-3 bg-canvas rounded animate-pulse w-1/2"></div>
                  </div>
                ) : notifications && notifications.length > 0 ? (
                  notifications.map(n => (
                    <div key={n.id} className={`p-4 border-b border-border-subtle last:border-0 hover:bg-canvas transition-colors ${!n.isRead ? 'bg-blue-50/30 dark:bg-brand-accent/5' : ''}`}>
                      <div className="flex gap-3">
                        <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${!n.isRead ? 'bg-brand-accent' : 'bg-transparent'}`} />
                        <div className="flex-1">
                          <p className="text-sm text-text-primary font-medium">{n.title}</p>
                          <p className="text-xs text-text-muted mt-1 leading-snug">{n.message}</p>
                          <span className="text-[10px] text-text-muted mt-2 block font-medium">{timeAgo(n.date)}</span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-text-muted text-sm">No notifications</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Accessibility */}
        <div className="relative" ref={accessRef}>
          <button 
            onClick={() => setIsAccessOpen(!isAccessOpen)}
            className="hidden md:flex p-2 text-text-muted hover:bg-canvas rounded-full transition-colors min-h-[44px] min-w-[44px] items-center justify-center"
          >
            <Accessibility className="w-5 h-5" />
          </button>

          {isAccessOpen && (
            <div className="absolute top-full right-0 mt-2 w-72 bg-surface border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-4 flex flex-col gap-4">
              <h3 className="font-semibold text-sm border-b border-border-subtle pb-2">Accessibility Options</h3>
              
              {/* Text Scaling */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-text-muted font-medium">Text Scaling</label>
                <div className="flex bg-canvas p-1 rounded-lg border border-border-subtle">
                  {['Default', 'Large', 'Extra Large'].map((size) => (
                    <button
                      key={size}
                      onClick={() => handleFontSizeChange(size)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                        font_size === size 
                          ? 'bg-surface shadow-sm text-text-primary' 
                          : 'text-text-muted hover:text-text-primary'
                      }`}
                    >
                      {size === 'Extra Large' ? 'XL' : size}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-text-muted font-medium flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" /> High Contrast Mode
                  </label>
                  <button 
                    onClick={handleHighContrastToggle}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${high_contrast ? 'bg-brand-accent' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${high_contrast ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                <p className="text-[10px] text-text-muted leading-tight mt-1">
                  Increases overall contrast limits globally across surfaces.
                </p>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
