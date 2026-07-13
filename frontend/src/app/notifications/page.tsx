"use client";

import React from 'react';
import { useFetchData } from '@/hooks/useFetchData';
import { Bell, CheckCircle, Info, AlertTriangle } from 'lucide-react';

interface Notification {
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info';
  date: string;
  isRead: boolean;
}

export default function NotificationsPage() {
  const { data, isLoading, error } = useFetchData<Notification[]>('/notifications/');

  const getIcon = (type: string) => {
    switch(type) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-5 h-5 text-orange-600" />;
      default: return <Info className="w-5 h-5 text-brand-accent" />;
    }
  };

  const getBg = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-surface border-border-subtle';
    switch(type) {
      case 'success': return 'bg-green-50/50 border-green-200';
      case 'warning': return 'bg-orange-50/50 border-orange-200';
      default: return 'bg-blue-50/50 border-blue-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between border-b border-border-subtle pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-brand-accent">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[22px] font-bold text-text-primary leading-tight">Notifications</h2>
            <p className="text-text-muted text-[14px]">Your recent alerts and updates.</p>
          </div>
        </div>
        <button className="text-[13px] font-medium text-brand-accent hover:underline">Mark all as read</button>
      </div>

      <div className="flex flex-col gap-3">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="p-4 rounded-xl border border-border-subtle bg-surface flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-canvas animate-pulse shrink-0"></div>
              <div className="flex flex-col gap-2 w-full">
                <div className="h-4 bg-canvas rounded animate-pulse w-1/3"></div>
                <div className="h-3 bg-canvas rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="p-4 bg-red-50 text-red-600 rounded-md border border-red-200">Failed to load notifications.</div>
        ) : data && data.length > 0 ? (
          data.map((notif: Notification, i: number) => (
            <div key={i} className={`p-4 rounded-xl border flex items-start gap-4 transition-colors hover:shadow-sm ${getBg(notif.type, notif.isRead)}`}>
              <div className="mt-1 shrink-0">{getIcon(notif.type)}</div>
              <div className="flex flex-col w-full">
                <div className="flex items-center justify-between mb-1">
                  <h4 className={`text-[15px] ${notif.isRead ? 'font-medium text-text-primary' : 'font-bold text-text-primary'}`}>{notif.title}</h4>
                  <span className="text-[12px] text-text-muted">{new Date(notif.date).toLocaleDateString()}</span>
                </div>
                <p className={`text-[14px] ${notif.isRead ? 'text-text-muted' : 'text-text-primary'}`}>{notif.message}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-text-muted">You have no new notifications.</div>
        )}
      </div>
    </div>
  );
}
