import { useState, useEffect } from 'react';

export function useFetchData<T>(endpoint: string) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`http://localhost:8000${endpoint}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch from ${endpoint}`);
        }
        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err : new Error(String(err)));
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [endpoint]);

  return { data, isLoading, error };
}
