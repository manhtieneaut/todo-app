'use client';

import { useEffect, useState } from 'react';
import { fetchTasks, deleteTask } from '../../../api/taskApi';
import { useTaskStore } from '../../../store/task';
import AddTaskModal from './AddTaskModal';
import { Task } from '../../../store/task';

export default function TaskPage() {
  const tasks = useTaskStore((state) => state.tasks);
  const setTasks = useTaskStore((state) => state.setTasks);
  const removeTask = useTaskStore((state) => state.deleteTask);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const tasks = await fetchTasks();
        setTasks(tasks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [setTasks]);

  const handleDeleteTask = async (taskId: string) => {
    const confirmDelete = confirm("Bạn có chắc chắn muốn xóa công việc này?");
    if (!confirmDelete) return;

    try {
      await deleteTask(taskId);
      removeTask(taskId);
      setSelectedTask(null);
    } catch (error: any) {
      alert(`Lỗi khi xóa công việc: ${error.message}`);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Không có';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN').format(date); // -> 08/04/2025
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải công việc...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Lỗi: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Danh sách công việc</h1>

      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Thêm Task
        </button>
      </div>

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
            <tr key={task.id} className="hover:bg-gray-100">
              <td className="px-4 py-2 cursor-pointer" onClick={() => setSelectedTask(task)}>
                {task.title}
              </td>
              <td className="px-4 py-2">{task.description || "Không có mô tả"}</td>
              <td className="px-4 py-2">{task.status}</td>
              <td className="px-4 py-2">{formatDate(task.due_date)}</td>
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
            <p className="mb-4"><strong>Thời hạn:</strong> {formatDate(selectedTask.due_date)}</p>

            <div className="flex justify-end mt-4">
              <button
                onClick={() => setSelectedTask(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && <AddTaskModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
}
