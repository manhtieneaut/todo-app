// src/hooks/useTaskPage.ts
import { useEffect, useState } from 'react';
import { useTaskStore } from '@/store/task';
import { fetchTasks } from '@/api/taskApi';

export const useTaskPage = (page: number, limit: number) => {
  const { setTasks } = useTaskStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, total } = await fetchTasks(page, limit);
        setTasks(data);
        setTotal(total);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [page, limit, setTasks]);

  return { loading, error, total };
};
