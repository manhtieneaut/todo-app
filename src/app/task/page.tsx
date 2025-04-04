"use client";

import { useEffect } from "react";
import { useTodoStore } from "@/lib/taskStore"; // Đảm bảo đường dẫn đúng

export default function Todos() {
  const { todos, loading, error, fetchTodos } = useTodoStore();

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return (
    <div className="flex min-h-screen justify-center items-center bg-white">
      <div className="w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center">Đang tải...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div>
            <div className="overflow-x-auto mt-6">
              <table className="min-w-full table-auto table-layout-fixed">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => (
                    <tr key={todo.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{todo.title}</td>
                      <td className="px-4 py-2">{todo.description}</td>
                      <td className="px-4 py-2">{todo.status}</td>
                      <td className="px-4 py-2">{todo.created_at}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
