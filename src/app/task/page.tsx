'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient'; // Đường dẫn đến file supabaseClient.js của bạn

export default function TaskPage() {
  const [tasks, setTasks] = useState<any[]>([]); // Định nghĩa kiểu dữ liệu là mảng bất kỳ
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("note_app.tasks") // Tên bảng của bạn là 'tasks'
          .select('*'); // Chọn tất cả các cột

        if (error) {
          throw error;
        }

        if (data) {
          setTasks(data);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []); // [] ở đây có nghĩa là useEffect chỉ chạy một lần sau lần render đầu tiên

  if (loading) {
    return <div>Đang tải công việc...</div>;
  }

  if (error) {
    return <div>Lỗi khi tải công việc: {error}</div>;
  }

  return (
    <div>
      <h1>Danh sách công việc (JSON)</h1>
      <pre>{JSON.stringify(tasks, null, 2)}</pre> {/* Hiển thị JSON đẹp hơn */}
    </div>
  );
}