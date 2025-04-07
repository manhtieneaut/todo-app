'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

interface AddTaskModalProps {
  onClose: () => void; // Hàm đóng modal
  onTaskAdded: (task: any) => void; // Hàm callback khi task được thêm
}

export default function AddTaskModal({ onClose, onTaskAdded }: AddTaskModalProps) {
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
  }); // Dữ liệu task mới
  const [error, setError] = useState<string | null>(null);

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      alert('Tiêu đề không được để trống!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tasks")
        .insert([newTask])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        onTaskAdded(data[0]); // Gọi callback để cập nhật danh sách task
        setNewTask({ title: '', description: '', status: 'pending', due_date: '' }); // Reset form
        onClose(); // Đóng modal
      }
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Thêm công việc mới</h2>
        <input
          type="text"
          placeholder="Tiêu đề"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />
        <textarea
          placeholder="Mô tả"
          value={newTask.description}
          onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />
        <select
          value={newTask.status}
          onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <input
          type="date"
          value={newTask.due_date}
          onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Hủy
          </button>
          <button
            onClick={handleAddTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            Thêm
          </button>
        </div>
      </div>
    </div>
  );
}