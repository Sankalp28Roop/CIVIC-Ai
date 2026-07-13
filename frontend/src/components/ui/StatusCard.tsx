import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ChevronRight } from 'lucide-react';

interface StatusCardProps {
  title: string;
  tagline: string;
  status: string;
  iconName: string;
}

export function StatusCard({ title, tagline, status, iconName }: StatusCardProps) {
  // Dynamically resolve icon from lucide-react (fallback to FileText)
  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[
    iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
  ] || LucideIcons.FileText;

  const getStatusColor = () => {
    switch (status) {
      case 'Active': return 'bg-green-500';
      case 'In Progress': return 'bg-blue-600';
      case 'Not Applied': 
      case 'Not Eligible': return 'bg-gray-400';
      default: return 'bg-gray-200';
    }
  };

  const getIconColorPair = () => {
    // Generate soft backgrounds based on icon name or title for variety
    if (title.includes('Kisan')) return 'text-green-600 bg-green-50 border-green-100';
    if (title.includes('Ayushman')) return 'text-blue-600 bg-blue-50 border-blue-100';
    if (title.includes('Awas')) return 'text-orange-500 bg-orange-50 border-orange-100';
    if (title.includes('Scholarship')) return 'text-purple-600 bg-purple-50 border-purple-100';
    if (title.includes('Ujjwala')) return 'text-red-500 bg-red-50 border-red-100';
    if (title.includes('Mudra')) return 'text-yellow-600 bg-yellow-50 border-yellow-100';
    if (title.includes('Pension')) return 'text-teal-600 bg-teal-50 border-teal-100';
    if (title.includes('Jan Dhan')) return 'text-indigo-600 bg-indigo-50 border-indigo-100';
    return 'text-brand-accent bg-blue-50 border-blue-100'; // fallback
  };

  return (
    <div className="bg-surface rounded-2xl p-5 flex items-center justify-between transition-transform hover:-translate-y-[2px] group cursor-pointer border border-border-subtle shadow-sm hover:shadow-md">
      
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border ${getIconColorPair()}`}>
          <IconComponent className="w-[22px] h-[22px]" strokeWidth={2} />
        </div>
        
        <div className="flex-1 mt-0.5">
          <h4 className="font-semibold text-text-primary text-[15px] leading-tight mb-1">{title}</h4>
          <p className="text-[13px] text-text-muted mb-3 leading-none">{tagline}</p>
          
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex rounded-full h-1.5 w-1.5 ${getStatusColor()}`}></span>
            <span className="text-[12px] font-medium text-text-primary">
              {status}
            </span>
          </div>
        </div>
      </div>

      <div className="pl-2">
         <ChevronRight className="w-5 h-5 text-text-muted opacity-60 group-hover:opacity-100 transition-opacity" />
      </div>
      
    </div>
  );
}

export function StatusCardSkeleton() {
  return (
    <div className="bg-surface rounded-2xl p-5 flex items-center justify-between border border-border-subtle shadow-sm">
      <div className="flex items-start gap-4 w-full">
        <div className="w-11 h-11 rounded-full bg-canvas animate-pulse shrink-0"></div>
        <div className="flex-1 mt-1">
          <div className="h-4 bg-canvas rounded animate-pulse w-3/4 mb-2"></div>
          <div className="h-3 bg-canvas rounded animate-pulse w-1/2 mb-4"></div>
          <div className="flex items-center gap-2">
             <div className="w-1.5 h-1.5 rounded-full bg-canvas animate-pulse"></div>
             <div className="h-3 bg-canvas rounded animate-pulse w-1/4"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
