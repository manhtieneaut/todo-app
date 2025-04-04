"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/app/supabaseClient"; // Đảm bảo đường dẫn đúng

export default function Todos() {
  interface Todo {
    id: string;
    title: string;
    description: string;
    status: string;
    created_at: string;
  }

  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newTodo, setNewTodo] = useState({
    title: "",
    description: "",
    status: "pending",
  });
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTodos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("todos").select("*");
    if (error) {
      setError("Không thể lấy danh sách todos: " + error.message);
    } else {
      setTodos(data);
    }
    setLoading(false);
  };

  const addTodo = async () => {
    const { title, description } = newTodo;
    const { data, error } = await supabase
      .from("todos")
      .insert([{ title, description, status: "pending" }]);
    if (error) {
      console.error("Error adding todo:", error.message);
    } else {
      if (data) {
        setTodos((prevTodos) => [...prevTodos, ...data]);
      }
    }
    setNewTodo({ title: "", description: "", status: "pending" });
    closeModal();
  };

  const updateTodo = async () => {
    if (editingTodo) {
      const { title, description, id } = editingTodo;
      const { data, error } = await supabase
        .from("todos")
        .update([{ title, description }])
        .eq("id", id);
      if (error) {
        console.error("Error updating todo:", error.message);
      } else {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.id === id ? { ...todo, title, description } : todo
          )
        );
      }
      setEditingTodo(null);
      closeModal();
    }
  };

  const deleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);
    if (error) {
      setError("Không thể xóa todo: " + error.message);
    } else {
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  return (
    <div className="flex min-h-screen justify-center items-center bg-white">
      <div className="w-full max-w-5xl p-6 bg-white rounded-lg shadow-lg">
        {loading ? (
          <p className="text-center">Đang tải...</p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
            >
              Thêm Todo
            </button>

            <div className="overflow-x-auto mt-6">
              <table className="min-w-full table-auto table-layout-fixed">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">Description</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Created At</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {todos.map((todo) => (
                    <tr key={todo.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{todo.title}</td>
                      <td className="px-4 py-2">{todo.description}</td>
                      <td className="px-4 py-2">{todo.status}</td>
                      <td className="px-4 py-2">{todo.created_at}</td>
                      <td className="px-4 py-2 flex gap-3">
                        <button
                          onClick={() => {
                            setEditingTodo(todo);
                            setIsModalOpen(true);
                          }}
                          className="text-yellow-600 hover:text-yellow-700"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => deleteTodo(todo.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      <div
        className={`fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center ${isModalOpen ? 'block' : 'hidden'}`}
      >
        <div className="bg-white p-8 rounded-lg shadow-lg w-full sm:w-96">
          <h2 className="text-2xl font-semibold mb-4 text-center">
            {editingTodo ? 'Sửa Todo' : 'Thêm Todo'}
          </h2>
          <input
            type="text"
            placeholder="Title"
            value={editingTodo ? editingTodo.title : newTodo.title}
            onChange={(e) =>
              editingTodo
                ? setEditingTodo({ ...editingTodo, title: e.target.value })
                : setNewTodo({ ...newTodo, title: e.target.value })
            }
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          />
          <textarea
            placeholder="Description"
            value={editingTodo ? editingTodo.description : newTodo.description}
            onChange={(e) =>
              editingTodo
                ? setEditingTodo({ ...editingTodo, description: e.target.value })
                : setNewTodo({ ...newTodo, description: e.target.value })
            }
            className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-md"
          />
          <div className="flex justify-between">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-black rounded-md"
            >
              Hủy
            </button>
            <button
              onClick={editingTodo ? updateTodo : addTodo}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {editingTodo ? 'Cập nhật Todo' : 'Thêm Todo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
