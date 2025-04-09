'use client';

import { useEffect, useState } from 'react';
import { fetchTasks, deleteTask, updateTaskStatus, shareTaskWithUser } from '@/api/taskApi';
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


  const [isShareModalOpen, setIsShareModalOpen] = useState(false);



  const STATUS_OPTIONS = ['chưa làm', 'đang làm', 'hoàn thành'];

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

  const handleChangeStatus = async (taskId: string, newStatus: string) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));
    } catch (error: any) {
      alert(`Lỗi khi cập nhật trạng thái: ${error.message}`);
    }
  };



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
    return new Intl.DateTimeFormat('vi-VN').format(date);
  };

  const renderStatusBadge = (status: string) => {
    const base = 'inline-block px-2 py-1 text-xs font-semibold rounded-full';
    switch (status) {
      case 'hoàn thành':
        return <span className={`${base} bg-green-100 text-green-700`}>{status}</span>;
      case 'đang làm':
        return <span className={`${base} bg-yellow-100 text-yellow-700`}>{status}</span>;
      default:
        return <span className={`${base} bg-gray-100 text-gray-700`}>{status}</span>;
    }
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
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Thêm Task
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tiêu đề</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Mô tả</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Trạng thái</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Thời hạn</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.map((task) => (
              <tr key={task.id} className="hover:bg-gray-50 transition">
                <td
                  className="px-6 py-4 text-sm font-medium text-blue-600 cursor-pointer"

                >
                  {task.title}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{task.description || "Không có mô tả"}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => handleChangeStatus(task.id, e.target.value)}
                      className="text-sm rounded-md border border-gray-300 px-3 py-1 bg-white shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(task.due_date)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="inline-flex items-center gap-2 bg-red-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-red-600 transition"
                  >
                    🗑 Xóa
                  </button>

                  <button
                    onClick={() => setIsShareModalOpen(true)}  // Pass the task id and selected userId
                    className="inline-flex items-center gap-2 bg-blue-500 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-600 transition"
                  >
                    Chia sẻ
                  </button>

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal chi tiết công việc */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
            <h2 className="text-2xl font-bold mb-4">{selectedTask.title}</h2>
            <p className="mb-4"><strong>Mô tả:</strong> {selectedTask.description || "Không có mô tả"}</p>
            <p className="mb-4"><strong>Trạng thái:</strong> {renderStatusBadge(selectedTask.status)}</p>
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
