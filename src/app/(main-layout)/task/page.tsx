'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AddTaskModal from './AddTaskModal';

export default function TaskPage() {
  const [tasks, setTasks] = useState<any[]>([]); // Danh sách công việc
  const [selectedTask, setSelectedTask] = useState<any | null>(null); // Công việc được chọn
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng modal thêm task

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const { data, error } = await supabase
          .from("tasks")
          .select('id, title, description, status, due_date');

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
  }, []); // Chạy một lần khi component được render

  const closeModal = () => {
    setSelectedTask(null);
  };

  const handleTaskAdded = (task: any) => {
    setTasks((prevTasks) => [...prevTasks, task]); // Cập nhật danh sách công việc
  };

  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa công việc này?");
    if (!confirmDelete) return;

    try {
      const { error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (error) {
        throw error;
      }

      // Cập nhật danh sách công việc sau khi xóa
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      closeModal(); // Đóng modal nếu đang mở
    } catch (error: any) {
      alert(`Lỗi khi xóa công việc: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải công việc...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Lỗi khi tải công việc: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Danh sách công việc</h1>

      {/* Nút mở modal thêm task */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Thêm Task
        </button>
      </div>

      {/* Danh sách công việc */}
      <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Tiêu đề</th>
            <th className="px-4 py-2 text-left">Mô tả</th>
            <th className="px-4 py-2 text-left">Trạng thái</th>
            <th className="px-4 py-2 text-left">Thời hạn</th>
            <th className="px-4 py-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="hover:bg-gray-100"
            >
              <td className="px-4 py-2 cursor-pointer" onClick={() => setSelectedTask(task)}>
                {task.title}
              </td>
              <td className="px-4 py-2">{task.description || "Không có mô tả"}</td>
              <td className="px-4 py-2">{task.status}</td>
              <td className="px-4 py-2">{task.due_date || "Không có"}</td>
              <td className="px-4 py-2">
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal chi tiết công việc */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
            <p className="mb-4"><strong>Mô tả:</strong> {selectedTask.description || "Không có mô tả"}</p>
            <p className="mb-4"><strong>Trạng thái:</strong> {selectedTask.status}</p>
            <p className="mb-4"><strong>Thời hạn:</strong> {selectedTask.due_date || "Không có"}</p>

            {/* Nút đóng modal */}
            <div className="flex justify-end mt-4">
              <button
                onClick={closeModal}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal thêm task */}
      {isModalOpen && (
        <AddTaskModal
          onClose={() => setIsModalOpen(false)}
          onTaskAdded={handleTaskAdded}
        />
      )}
    </div>
  );
}