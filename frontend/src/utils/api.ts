const rawUrl = 
  process.env.NEXT_PUBLIC_API_URL || 
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) || 
  'http://localhost:8000';

export const API_BASE_URL = rawUrl.replace(/\/+$/, '');
