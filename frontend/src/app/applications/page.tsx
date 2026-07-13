"use client";

import React from 'react';
import { useFetchData } from '@/hooks/useFetchData';
import { Activity, Search } from 'lucide-react';

interface Application {
  refId: string;
  schemeName: string;
  dateSubmitted: string;
  status: 'Under Review' | 'Approved' | 'Action Required';
}

export default function ApplicationsPage() {
  const { data, isLoading, error } = useFetchData<Application[]>('/applications/');

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'Approved': return 'bg-green-50 text-green-700 border-green-200';
      case 'Under Review': return 'bg-blue-50 text-brand-accent border-blue-200';
      case 'Action Required': return 'bg-orange-50 text-orange-700 border-orange-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div>
          <h2 className="text-[24px] font-bold text-text-primary">My Applications</h2>
          <p className="text-text-muted text-[14px] mt-1">Track the real-time status of your submitted forms.</p>
        </div>
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
          <input 
            type="text" 
            placeholder="Search Reference ID..." 
            className="w-full bg-surface border border-border-subtle rounded-md pl-9 pr-4 py-2 text-[14px] text-text-primary outline-none focus-visible:ring-1 shadow-sm"
          />
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border-subtle overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border-subtle bg-canvas/50">
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider">Ref ID</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider">Scheme Name</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider">Date Submitted</th>
                <th className="px-6 py-4 text-[13px] font-semibold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="border-b border-border-subtle last:border-0">
                    <td className="px-6 py-4"><div className="h-4 bg-canvas rounded animate-pulse w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-canvas rounded animate-pulse w-48"></div></td>
                    <td className="px-6 py-4"><div className="h-4 bg-canvas rounded animate-pulse w-24"></div></td>
                    <td className="px-6 py-4"><div className="h-6 bg-canvas rounded animate-pulse w-28"></div></td>
                    <td className="px-6 py-4"></td>
                  </tr>
                ))
              ) : error ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-red-500">Failed to load applications.</td></tr>
              ) : data && data.length > 0 ? (
                data.map((app: Application, i: number) => (
                  <tr key={i} className="border-b border-border-subtle last:border-0 hover:bg-canvas/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-[13px] text-text-muted">{app.refId}</td>
                    <td className="px-6 py-4 font-medium text-text-primary text-[14px]">{app.schemeName}</td>
                    <td className="px-6 py-4 text-[14px] text-text-muted">{new Date(app.dateSubmitted).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium border ${getStatusStyle(app.status)}`}>
                        {app.status === 'Under Review' && <Activity className="w-3 h-3 mr-1.5 animate-pulse" />}
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[13px] font-medium text-brand-accent hover:underline">View</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-text-muted">No applications found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
