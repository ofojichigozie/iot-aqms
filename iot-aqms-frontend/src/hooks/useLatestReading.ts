import { useState, useEffect, useCallback } from 'react';
import { Reading } from '../types';
import * as readingsService from '../services/readings.service';

export const useLatestReading = (autoRefreshMs = 15000) => {
  const [reading, setReading] = useState<Reading | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await readingsService.fetchLatestReading();
      setReading(data);
    } catch {
      setError('No readings yet');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const interval = setInterval(() => void load(), autoRefreshMs);
    return () => clearInterval(interval);
  }, [load, autoRefreshMs]);

  return { reading, loading, error, refetch: load };
};
