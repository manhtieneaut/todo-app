"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage() {
  useEffect(() => {
    const checkSession = async () => {
      const sessionToken = localStorage.getItem("jwt_token");

      // Nếu không có token, chuyển hướng tới trang đăng nhập
      if (!sessionToken) {
        redirect("/auth");
      } else {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          redirect("/auth");
        }
      }
    };

    checkSession();
  }, []); // Chạy một lần khi component được render

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold">Trang Chính</h1>
        <p className="mt-4">Chào mừng bạn đến với trang chính của ứng dụng!</p>
        <p className="mt-2">Đây là nơi bạn có thể tìm thấy thông tin và chức năng chính của ứng dụng.</p>
      </div>
    </div>
  );
}
