import React from 'react';
import * as LucideIcons from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface StatusCardProps {
  title: string;
  tagline: string;
  status: string;
  iconName: string;
}

export function StatusCard({ title, tagline, status, iconName }: StatusCardProps) {
  const { translateScheme, isRTL } = useLanguage();
  
  // Translate scheme strings if Hindi or Urdu is active
  const translated = translateScheme({ title, tagline, status });

  // Dynamically resolve icon from lucide-react (fallback to FileText)
  const IconComponent = (LucideIcons as unknown as Record<string, React.ElementType>)[
    iconName.split('-').map(part => part.charAt(0).toUpperCase() + part.slice(1)).join('')
  ] || LucideIcons.FileText;

  const getStatusColor = () => {
    switch (translated.status) {
      case 'Active':
      case 'सक्रिय':
      case 'فعال': return 'bg-green-500';
      case 'In Progress':
      case 'प्रक्रिया में':
      case 'زیرِ عمل': return 'bg-blue-600';
      case 'Not Applied':
      case 'आवेदन नहीं किया':
      case 'درخواست نہیں دی':
      case 'Not Eligible':
      case 'पात्र नहीं':
      case 'نااہل': return 'bg-gray-400';
      default: return 'bg-gray-200';
    }
  };

  const getIconColorPair = () => {
    if (title.includes('Kisan') || translated.title.includes('किसान') || translated.title.includes('کسان')) return 'text-green-600 bg-green-50 border-green-100 dark:bg-green-950/30 dark:border-green-800/40';
    if (title.includes('Ayushman') || translated.title.includes('आयुष्मान') || translated.title.includes('آیوشمان')) return 'text-blue-600 bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/40';
    if (title.includes('Awas') || translated.title.includes('आवास') || translated.title.includes('آواس')) return 'text-orange-500 bg-orange-50 border-orange-100 dark:bg-orange-950/30 dark:border-orange-800/40';
    if (title.includes('Scholarship') || translated.title.includes('छात्रवृत्ति')) return 'text-purple-600 bg-purple-50 border-purple-100 dark:bg-purple-950/30 dark:border-purple-800/40';
    if (title.includes('Ujjwala') || translated.title.includes('उज्ज्वला') || translated.title.includes('اُجّولا')) return 'text-red-500 bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-800/40';
    if (title.includes('Mudra') || translated.title.includes('मुद्रा')) return 'text-yellow-600 bg-yellow-50 border-yellow-100 dark:bg-yellow-950/30 dark:border-yellow-800/40';
    if (title.includes('Pension') || translated.title.includes('पेंशन') || translated.title.includes('پنشن')) return 'text-teal-600 bg-teal-50 border-teal-100 dark:bg-teal-950/30 dark:border-teal-800/40';
    if (title.includes('Jan Dhan') || translated.title.includes('जन धन')) return 'text-indigo-600 bg-indigo-50 border-indigo-100 dark:bg-indigo-950/30 dark:border-indigo-800/40';
    return 'text-brand-accent bg-blue-50 border-blue-100 dark:bg-blue-950/30 dark:border-blue-800/40'; // fallback
  };

  return (
    <div className="bg-surface rounded-2xl p-5 flex items-center justify-between transition-transform hover:-translate-y-[2px] group cursor-pointer border border-border-subtle shadow-sm hover:shadow-md">
      
      <div className="flex items-start gap-4">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 border ${getIconColorPair()}`}>
          <IconComponent className="w-[22px] h-[22px]" strokeWidth={2} />
        </div>
        
        <div className="flex-1 mt-0.5">
          <h4 className="font-semibold text-text-primary text-[15px] leading-tight mb-1">{translated.title}</h4>
          <p className="text-[13px] text-text-muted mb-3 leading-snug">{translated.tagline}</p>
          
          <div className="flex items-center gap-1.5">
            <span className={`inline-flex rounded-full h-1.5 w-1.5 shrink-0 ${getStatusColor()}`}></span>
            <span className="text-[12px] font-medium text-text-primary">
              {translated.status}
            </span>
          </div>
        </div>
      </div>

      <div className={isRTL ? "pr-2" : "pl-2"}>
         <ChevronRight className={`w-5 h-5 text-text-muted opacity-60 group-hover:opacity-100 transition-transform ${isRTL ? 'rotate-180' : ''}`} />
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
