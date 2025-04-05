"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // Điều khiển form đăng ký hay đăng nhập
  const supabase = createClient();
  const router = useRouter();

  const handleAuth = async () => {
    let response;
    if (isSignUp) {
      // Đăng ký (sign up)
      response = await supabase.auth.signUp({ email, password });
    } else {
      // Đăng nhập (login)
      response = await supabase.auth.signInWithPassword({ email, password });
    }

    if (response.error) {
      alert("Lỗi: " + response.error.message);
    } else {
      alert(isSignUp ? "Đăng ký thành công!" : "Đăng nhập thành công!");
      const { session } = response.data;

      // Lưu token vào cookie khi đăng nhập thành công
      document.cookie = `jwt_token=${session?.access_token}; path=/; max-age=3600`; // token hết hạn sau 1 giờ

      // Chuyển hướng đến trang chính sau khi đăng nhập thành công
      router.push("/");
    }
  };

  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md">
        <h1 className="text-4xl font-extrabold text-center text-gray-800 mb-6">
          {isSignUp ? "Đăng ký" : "Đăng nhập"}
        </h1>

        <div className="mb-5">
          <input
            type="email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
          />
        </div>

        <div className="mb-6">
          <input
            type="password"
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-600 text-lg"
          />
        </div>

        <button
          onClick={handleAuth}
          className="w-full p-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-purple-500 hover:to-indigo-500 transform transition-all duration-300 ease-in-out hover:scale-105"
        >
          {isSignUp ? "Đăng ký" : "Đăng nhập"}
        </button>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-purple-600 hover:underline focus:ring-2 focus:ring-purple-500 transition-all duration-300 ease-in-out"
          >
            {isSignUp ? "Đã có tài khoản? Đăng nhập" : "Chưa có tài khoản? Đăng ký"}
          </button>
        </div>
      </div>
    </main>
  );
}
