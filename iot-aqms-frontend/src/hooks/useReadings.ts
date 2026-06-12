import { useState, useEffect, useCallback } from 'react';
import { Reading } from '../types';
import * as readingsService from '../services/readings.service';
import { notify } from '../utils/notification';

export const useReadings = (limit = 100) => {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await readingsService.fetchReadings(limit);
      setReadings(data);
    } catch {
      setError('Failed to load readings');
    } finally {
      setLoading(false);
    }
  }, [limit]);

  useEffect(() => {
    void load();
  }, [load]);

  const remove = async (id: string) => {
    try {
      await readingsService.deleteReading(id);
      setReadings((prev) => prev.filter((r) => r._id !== id));
      notify.success('Reading deleted');
    } catch {
      notify.error('Failed to delete reading');
    }
  };

  return { readings, loading, error, refetch: load, remove };
};
