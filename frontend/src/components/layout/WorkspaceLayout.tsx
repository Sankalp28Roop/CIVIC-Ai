"use client";

import React, { useState } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { FileText, Activity, Home, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Define mobile items (limited)
  const mobileNavItems = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Schemes', href: '/schemes', icon: FileText },
    { name: 'Applications', href: '/applications', icon: Activity },
    { name: 'Saved', href: '/saved', icon: Bookmark },
  ];

  return (
    <div className="flex h-screen bg-canvas overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} close={() => setIsSidebarOpen(false)} />
      
      <div className="flex flex-col flex-1 overflow-hidden relative min-w-0">
        <Header toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="w-full h-full p-4 md:p-8 lg:p-12">
            <div className="max-w-[1200px] mx-auto w-full">
              {children}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-14 bg-surface border-t border-border-subtle flex items-center justify-around z-50">
        {mobileNavItems.map((item) => {
          const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== '/');
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full min-h-[44px] min-w-[44px] transition-colors ${
                isActive ? 'text-brand-accent' : 'text-text-muted'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
