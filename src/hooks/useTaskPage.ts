// src/hooks/useTaskPage.ts
import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/task';

export const useTaskPage = () => {
  const { fetchAndSetTasks } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        await fetchAndSetTasks();
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fetchAndSetTasks]);

  return { loading, error };
};
