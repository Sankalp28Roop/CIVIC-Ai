import { useState, useEffect } from 'react';

export interface Scheme {
  id: string;
  title: string;
  tagline: string;
  status: 'Active' | 'In Progress' | 'Not Applied' | 'Not Eligible';
  icon: string;
}

export function useSchemes() {
  const [data, setData] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchSchemes() {
      try {
        const response = await fetch('http://localhost:8000/schemes/');
        if (!response.ok) {
          throw new Error('Failed to fetch schemes');
        }
        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchSchemes();
  }, []);

  return { data, isLoading, error };
}
