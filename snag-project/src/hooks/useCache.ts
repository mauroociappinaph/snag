import { useState, useCallback } from 'react';
import { cache } from '../lib/utils/cache';

export const useCache = <T>(key: string, ttl?: number) => {
  const [data, setData] = useState<T | null>(() => cache.get<T>(key));

  const setCache = useCallback((newData: T) => {
    cache.set(key, newData, ttl);
    setData(newData);
  }, [key, ttl]);

  const clearCache = useCallback(() => {
    cache.delete(key);
    setData(null);
  }, [key]);

  return {
    data,
    setCache,
    clearCache,
  };
};
