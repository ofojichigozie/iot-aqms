import { useState, useEffect, useCallback } from 'react';
import { Stats } from '../types';
import * as readingsService from '../services/readings.service';

export const useStats = (autoRefreshMs?: number) => {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const data = await readingsService.fetchStats();
      setStats(data);
    } catch {
      setError('Failed to load stats');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    if (!autoRefreshMs) return;
    const interval = setInterval(() => void load(), autoRefreshMs);
    return () => clearInterval(interval);
  }, [load, autoRefreshMs]);

  return { stats, loading, error, refetch: load };
};
