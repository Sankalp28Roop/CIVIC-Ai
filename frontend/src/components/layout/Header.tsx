"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Bell, Search, Menu, Accessibility, Eye, Globe } from 'lucide-react';
import { useFetchData } from '@/hooks/useFetchData';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';
import { API_BASE_URL } from '@/utils/api';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  date: string;
  isRead: boolean;
}

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
  const { lang, toggleLanguage, setLang, t, isHindi, isUrdu } = useLanguage();
  
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
    fetch(`${API_BASE_URL}/users/me/settings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ font_size: size })
    }).catch(console.error);
  };

  const handleHighContrastToggle = () => {
    const newValue = !high_contrast;
    updatePreferences({ high_contrast: newValue });
    fetch(`${API_BASE_URL}/users/me/settings`, {
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
        <h1 className="font-bold text-lg tracking-tight font-sans text-brand-accent">
          {t.app_title}
        </h1>
      </div>

      {/* Desktop/Tablet Global Search */}
      <div className="hidden md:flex flex-1 max-w-xl mx-6 lg:mx-0">
        <div className="relative w-full">
          <Search className={`w-4 h-4 absolute top-1/2 -translate-y-1/2 text-text-muted ${isUrdu ? 'right-3' : 'left-3'}`} />
          <input 
            type="text" 
            placeholder={t.search_placeholder}
            className={`w-full bg-surface border border-border-subtle rounded-md py-2 text-sm text-text-primary outline-none focus-visible:ring-1 focus-visible:ring-brand-accent focus-visible:border-brand-accent transition-shadow shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${
              isUrdu ? 'pr-9 pl-4 text-right font-urdu' : 'pl-9 pr-4 text-left'
            }`}
          />
        </div>
      </div>

      {/* Right Icons */}
      <div className="flex items-center gap-2 lg:gap-3 ml-auto">
        
        {/* Multilingual Switcher Toggle (EN / HI / UR) */}
        <button
          onClick={toggleLanguage}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all flex items-center gap-2 min-h-[38px] shadow-sm cursor-pointer ${
            isHindi || isUrdu
              ? 'bg-brand-accent text-white border-brand-accent'
              : 'bg-surface text-text-primary border-border-subtle hover:bg-canvas'
          }`}
          title="Click to toggle language (English / हिन्दी / اُردُو)"
        >
          <div className="flex items-center gap-1 font-bold text-[13px]">
            <span>A</span>
            <span className="opacity-40">/</span>
            <span className="font-hindi text-[14px]">अ</span>
            <span className="opacity-40">/</span>
            <span className="font-urdu text-[15px] leading-none">اُ</span>
          </div>
          <span className="pl-1 border-l border-current/30 text-[12px] font-medium tracking-wide">
            {isUrdu ? 'اُردُو (Urdu)' : isHindi ? 'हिन्दी (Hindi)' : 'English'}
          </span>
        </button>

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
            <div className={`absolute top-full mt-2 w-80 bg-surface border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 ${isUrdu ? 'left-0' : 'right-0'}`}>
              <div className="flex items-center justify-between px-4 py-3 border-b border-border-subtle">
                <h3 className="font-semibold text-sm">{t.notifications}</h3>
                <span className="text-xs text-brand-accent cursor-pointer hover:underline">{t.mark_all_read}</span>
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
                  <div className="p-8 text-center text-text-muted text-sm">{t.no_notifications}</div>
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
            <div className={`absolute top-full mt-2 w-80 bg-surface border border-border-subtle rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 p-4 flex flex-col gap-4 ${isUrdu ? 'left-0' : 'right-0'}`}>
              <h3 className="font-semibold text-sm border-b border-border-subtle pb-2">{t.accessibility_options}</h3>
              
              {/* Multilingual Selection inside Accessibility */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-text-muted font-medium flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> {t.language}
                </label>
                <div className="grid grid-cols-3 gap-1 bg-canvas p-1 rounded-lg border border-border-subtle">
                  <button
                    onClick={() => setLang('en')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                      lang === 'en'
                        ? 'bg-surface shadow-sm text-text-primary'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => setLang('hi')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-all font-hindi ${
                      lang === 'hi'
                        ? 'bg-surface shadow-sm text-text-primary'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    हिन्दी
                  </button>
                  <button
                    onClick={() => setLang('ur')}
                    className={`py-1.5 text-xs font-medium rounded-md transition-all font-urdu ${
                      lang === 'ur'
                        ? 'bg-surface shadow-sm text-text-primary'
                        : 'text-text-muted hover:text-text-primary'
                    }`}
                  >
                    اُردُو
                  </button>
                </div>
              </div>

              {/* Text Scaling */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
                <label className="text-xs text-text-muted font-medium">{t.text_scaling}</label>
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
                      {size === 'Extra Large' ? 'XL' : isHindi && size === 'Default' ? 'सामान्य' : isHindi && size === 'Large' ? 'बड़ा' : isUrdu && size === 'Default' ? 'معمولی' : isUrdu && size === 'Large' ? 'بڑا' : size}
                    </button>
                  ))}
                </div>
              </div>

              {/* High Contrast */}
              <div className="flex flex-col gap-2 pt-2 border-t border-border-subtle">
                <div className="flex items-center justify-between">
                  <label className="text-xs text-text-muted font-medium flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" /> {t.high_contrast}
                  </label>
                  <button 
                    onClick={handleHighContrastToggle}
                    className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${high_contrast ? 'bg-brand-accent' : 'bg-gray-300 dark:bg-gray-600'}`}
                  >
                    <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${high_contrast ? 'translate-x-5' : 'translate-x-1'}`} />
                  </button>
                </div>
                <p className="text-[10px] text-text-muted leading-tight mt-1">
                  {t.high_contrast_desc}
                </p>
              </div>

            </div>
          )}
        </div>
      </div>
    </header>
  );
}
