'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TagList() {
  const [tags, setTags] = useState<any[]>([]); // Danh sách nhãn
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false); // Trạng thái mở/đóng modal
  const [newTag, setNewTag] = useState<string>(''); // Input để thêm nhãn mới

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const { data, error } = await supabase
          .from("tags")
          .select('id, name');

        if (error) {
          throw error;
        }

        if (data) {
          setTags(data);
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []); // Chạy một lần khi component được render

  const handleAddTag = async () => {
    if (!newTag.trim()) {
      alert('Tên nhãn không được để trống!');
      return;
    }

    try {
      const { data, error } = await supabase
        .from("tags")
        .insert([{ name: newTag }])
        .select();

      if (error) {
        throw error;
      }

      if (data) {
        setTags((prevTags) => [...prevTags, ...data]); // Cập nhật danh sách nhãn
        setNewTag(''); // Reset input
        setIsModalOpen(false); // Đóng modal
      }
    } catch (error: any) {
      alert(`Lỗi khi thêm nhãn: ${error.message}`);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Đang tải nhãn...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Lỗi khi tải nhãn: {error}</div>;
  }

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Danh sách nhãn</h1>

      {/* Nút mở modal thêm nhãn */}
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Thêm nhãn
        </button>
      </div>

      {/* Danh sách nhãn */}
      <table className="table-auto w-full bg-white shadow-md rounded-lg overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="px-4 py-2 text-left">Tên nhãn</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.id} className="hover:bg-gray-100">
              <td className="px-4 py-2">{tag.name}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal thêm nhãn */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Thêm nhãn mới</h2>
            <input
              type="text"
              placeholder="Tên nhãn..."
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Hủy
              </button>
              <button
                onClick={handleAddTag}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              >
                Thêm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}