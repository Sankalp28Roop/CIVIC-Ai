"use client";

import React, { useState, useEffect } from 'react';
import { User, Shield, Accessibility, Save, Activity, CheckCircle } from 'lucide-react';
import { useFetchData } from '@/hooks/useFetchData';
import { useTheme } from '@/context/ThemeContext';

const Toggle = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
  <div className="flex items-center justify-between py-3 border-b border-border-subtle last:border-0">
    <span className="text-[14px] font-medium text-text-primary">{label}</span>
    <button 
      onClick={() => onChange(!checked)}
      className={`w-11 h-6 rounded-full relative transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-accent ${checked ? 'bg-brand-accent' : 'bg-gray-300'}`}
    >
      <span className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${checked ? 'left-6' : 'left-1'}`} />
    </button>
  </div>
);

interface Settings {
  display_language?: string;
  system_theme?: string;
  notificationsEnabled?: boolean;
  emailAlerts?: boolean;
  smsAlerts?: boolean;
  twoFactorAuth?: boolean;
}

export default function SettingsPage() {
  const { updatePreferences, isLoading: isThemeLoading } = useTheme();
  const { data: initialSettings, isLoading: isDataLoading } = useFetchData<Settings>('/users/me/settings');
  const [activeTab, setActiveTab] = useState('account');
  const [settings, setSettings] = useState<Settings>({});
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const isLoading = isThemeLoading || isDataLoading;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initialSettings) setSettings(initialSettings);
  }, [initialSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('http://localhost:8000/users/me/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        // Update global context so the whole app updates immediately
        updatePreferences({
          system_theme: settings.system_theme,
          display_language: settings.display_language
        });
        setShowToast(true);
        setTimeout(() => setShowToast(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-5xl mx-auto w-full relative">
      {/* Toast Notification */}
      {showToast && (
        <div className="absolute top-0 right-0 transform -translate-y-full mb-4 bg-surface border border-border-subtle shadow-lg rounded-md px-4 py-2 flex items-center gap-2 animate-in fade-in slide-in-from-top-4 z-50">
          <CheckCircle className="w-4 h-4 text-brand-accent" />
          <span className="text-[13px] font-medium text-text-primary">Preferences Saved</span>
        </div>
      )}

      {/* Settings Navigation */}
      <div className="w-full md:w-64 shrink-0 flex flex-col gap-1">
        <h2 className="text-[24px] font-bold text-text-primary mb-4 px-2">Settings</h2>
        
        <button 
          onClick={() => setActiveTab('account')}
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-left text-[14px] font-medium transition-colors ${activeTab === 'account' ? 'bg-surface text-brand-accent shadow-sm border border-border-subtle' : 'text-text-muted hover:text-text-primary hover:bg-surface/50 border border-transparent'}`}
        >
          <User className="w-4 h-4" /> Account Preferences
        </button>
        <button 
          onClick={() => setActiveTab('security')}
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-left text-[14px] font-medium transition-colors ${activeTab === 'security' ? 'bg-surface text-brand-accent shadow-sm border border-border-subtle' : 'text-text-muted hover:text-text-primary hover:bg-surface/50 border border-transparent'}`}
        >
          <Shield className="w-4 h-4" /> Security & Privacy
        </button>
        <button 
          onClick={() => setActiveTab('accessibility')}
          className={`flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-left text-[14px] font-medium transition-colors ${activeTab === 'accessibility' ? 'bg-surface text-brand-accent shadow-sm border border-border-subtle' : 'text-text-muted hover:text-text-primary hover:bg-surface/50 border border-transparent'}`}
        >
          <Accessibility className="w-4 h-4" /> Accessibility
        </button>
      </div>

      {/* Settings Content Area */}
      <div className="w-full">
        {isLoading ? (
          <div className="bg-surface rounded-xl border border-border-subtle p-8 shadow-sm flex flex-col gap-6">
            <div className="h-6 bg-canvas rounded animate-pulse w-1/4"></div>
            <div className="h-px bg-border-subtle w-full"></div>
            <div className="flex flex-col gap-4">
              <div className="h-10 bg-canvas rounded animate-pulse w-full"></div>
              <div className="h-10 bg-canvas rounded animate-pulse w-full"></div>
            </div>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-border-subtle shadow-sm overflow-hidden">
            <div className="p-6 md:p-8">
              {activeTab === 'account' && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-[18px] font-bold text-text-primary">Account Preferences</h3>
                    <p className="text-[13px] text-text-muted mt-1">Manage your basic account configurations.</p>
                  </div>
                  <div className="flex flex-col gap-4 border-t border-border-subtle pt-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-semibold text-text-primary">Display Language</label>
                      <select 
                        className="input-field max-w-sm bg-canvas text-[14px]"
                        value={settings.display_language || ''}
                        onChange={(e) => setSettings({...settings, display_language: e.target.value})}
                      >
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Marathi">Marathi</option>
                      </select>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <label className="text-[13px] font-semibold text-text-primary">System Theme</label>
                      <select 
                        className="input-field max-w-sm bg-canvas text-[14px]"
                        value={settings.system_theme || ''}
                        onChange={(e) => setSettings({...settings, system_theme: e.target.value})}
                      >
                        <option value="Light">Light Mode</option>
                        <option value="Dark">Dark Mode</option>
                        <option value="System">System Default</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-[18px] font-bold text-text-primary">Security & Privacy</h3>
                    <p className="text-[13px] text-text-muted mt-1">Control your notification flows and login security.</p>
                  </div>
                  <div className="flex flex-col border-t border-border-subtle pt-2">
                    <Toggle 
                      label="Enable Push Notifications" 
                      checked={settings.notificationsEnabled || false} 
                      onChange={(v) => setSettings({...settings, notificationsEnabled: v})} 
                    />
                    <Toggle 
                      label="Email Alerts for Application Status" 
                      checked={settings.emailAlerts || false} 
                      onChange={(v) => setSettings({...settings, emailAlerts: v})} 
                    />
                    <Toggle 
                      label="SMS Alerts" 
                      checked={settings.smsAlerts || false} 
                      onChange={(v) => setSettings({...settings, smsAlerts: v})} 
                    />
                    <Toggle 
                      label="Two-Factor Authentication (2FA)" 
                      checked={settings.twoFactorAuth || false} 
                      onChange={(v) => setSettings({...settings, twoFactorAuth: v})} 
                    />
                  </div>
                </div>
              )}

              {activeTab === 'accessibility' && (
                <div className="flex flex-col gap-6 animate-in fade-in duration-300">
                  <div>
                    <h3 className="text-[18px] font-bold text-text-primary">Accessibility Options</h3>
                    <p className="text-[13px] text-text-muted mt-1">Make the platform easier to navigate.</p>
                  </div>
                  <div className="flex flex-col gap-4 border-t border-border-subtle pt-6 text-center py-10">
                    <Accessibility className="w-10 h-10 text-brand-accent mx-auto mb-2 opacity-50" />
                    <p className="text-text-muted text-[14px]">Screen reader compatibility is enabled by default.<br/>High contrast mode coming soon.</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 bg-canvas/50 border-t border-border-subtle flex justify-end">
              <button 
                onClick={handleSave} 
                disabled={isSaving}
                className="btn-primary h-[38px] px-6 text-[13px] disabled:opacity-70 flex items-center"
              >
                {isSaving ? <Activity className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Save Changes
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
