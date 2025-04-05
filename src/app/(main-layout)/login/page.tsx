"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/app/supabaseClient"; // Đảm bảo đường dẫn đúng
import useAuthStore from "@/lib/authStore"; 


export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const router = useRouter();

  const { setUser } = useAuthStore(); // sử dụng store zustand để cập nhật user

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
      } else {
        // Lưu thông tin người dùng vào state
        setUser(data?.user); // Cập nhật state với thông tin user
        localStorage.setItem("access_token", data?.session?.access_token || "");
        
        alert("Đăng nhập thành công!");
        router.push("/"); // Chuyển hướng đến trang chính
      }
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) setError(error.message);
      else {
        alert("Đăng ký thành công! Kiểm tra email của bạn.");
        setIsLogin(true); // Chuyển về trạng thái đăng nhập
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          {isLogin ? "Đăng nhập" : "Đăng ký"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {isLogin ? "Đăng nhập" : "Đăng ký"}
          </button>
        </form>
        {error && <p className="text-red-500 text-center mt-2">{error}</p>}
        <p className="text-center mt-4">
          {isLogin ? "Chưa có tài khoản? " : "Đã có tài khoản? "}
          <button
            className="text-blue-500 hover:underline"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Đăng ký" : "Đăng nhập"}
          </button>
        </p>
      </div>
    </div>
  );
}
