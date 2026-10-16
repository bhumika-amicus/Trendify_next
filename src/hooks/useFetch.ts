import { useState, useEffect, useCallback, useRef } from 'react';

export interface FetchOptions {
  skip?: boolean;
}

export function useFetch<T>(
  fetchFunction: (signal: AbortSignal) => Promise<T>,
  dependencies: readonly unknown[] = [],
  options?: FetchOptions
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!options?.skip);
  const [error, setError] = useState<string | null>(null);
  const [refreshIndex, setRefreshIndex] = useState(0);

  const fetchFunctionRef = useRef(fetchFunction);
  useEffect(() => {
    fetchFunctionRef.current = fetchFunction;
  });

  const refetch = useCallback(() => {
    setRefreshIndex((prev) => prev + 1);
  }, []);

  useEffect(() => {
    if (options?.skip) {
      return;
    }

    const controller = new AbortController();

    const executeFetch = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await fetchFunctionRef.current(controller.signal);
        if (controller.signal.aborted) return;
        setData(result);
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        if (controller.signal.aborted) return;
        console.error('useFetch error:', err);
        setError(
          err instanceof Error ? err.message : 'An unexpected error occurred.'
        );
        setData(null);
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void executeFetch();

    return () => {
      controller.abort();
    };
  }, [...dependencies, refreshIndex, options?.skip]);

  return { data, isLoading, error, refetch };
}
