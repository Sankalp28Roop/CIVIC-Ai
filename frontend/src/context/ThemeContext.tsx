"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ThemeContextType {
  system_theme: string;
  display_language: string;
  font_size: string;
  high_contrast: boolean;
  setSystemTheme: (theme: string) => void;
  setDisplayLanguage: (language: string) => void;
  setFontSize: (size: string) => void;
  setHighContrast: (enabled: boolean) => void;
  updatePreferences: (preferences: { system_theme?: string; display_language?: string; font_size?: string; high_contrast?: boolean }) => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [system_theme, setSystemTheme] = useState<string>('System');
  const [display_language, setDisplayLanguage] = useState<string>('English');
  const [font_size, setFontSize] = useState<string>('Default');
  const [high_contrast, setHighContrast] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Fetch initial preferences
  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await fetch('http://localhost:8000/users/me/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.system_theme) setSystemTheme(data.system_theme);
          if (data.display_language) setDisplayLanguage(data.display_language);
          if (data.font_size) setFontSize(data.font_size);
          if (typeof data.high_contrast === 'boolean') setHighContrast(data.high_contrast);
        }
      } catch (err) {
        console.error('Failed to fetch user preferences:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  // Update document classes when theme or accessibility changes
  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    // Theme logic
    if (system_theme === 'Dark') {
      root.classList.add('dark');
    } else if (system_theme === 'Light') {
      root.classList.remove('dark');
    } else {
      // For 'System'
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }

    // Font size logic
    root.classList.remove('font-scale-lg', 'font-scale-xl');
    if (font_size === 'Large') {
      root.classList.add('font-scale-lg');
    } else if (font_size === 'Extra Large') {
      root.classList.add('font-scale-xl');
    }

    // High contrast logic
    if (high_contrast) {
      body.classList.add('contrast-high');
    } else {
      body.classList.remove('contrast-high');
    }
  }, [system_theme, font_size, high_contrast]);

  const updatePreferences = (preferences: { system_theme?: string; display_language?: string; font_size?: string; high_contrast?: boolean }) => {
    if (preferences.system_theme !== undefined) setSystemTheme(preferences.system_theme);
    if (preferences.display_language !== undefined) setDisplayLanguage(preferences.display_language);
    if (preferences.font_size !== undefined) setFontSize(preferences.font_size);
    if (preferences.high_contrast !== undefined) setHighContrast(preferences.high_contrast);
  };

  return (
    <ThemeContext.Provider value={{ 
      system_theme, display_language, font_size, high_contrast,
      setSystemTheme, setDisplayLanguage, setFontSize, setHighContrast, 
      updatePreferences, isLoading 
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
