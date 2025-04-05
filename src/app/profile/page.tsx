"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabaseClient"; // Đảm bảo bạn đã cài Supabase client

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Hàm lấy thông tin người dùng từ Supabase
    const fetchUserInfo = async () => {
      const token = document.cookie.split(';').find(c => c.trim().startsWith('jwt_token='));
      if (!token) {
        alert("Bạn cần đăng nhập!");
        return;
      }

      const access_token = token.split('=')[1];

      // Sử dụng token để lấy session người dùng
      const { data: session, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.error("Lỗi khi lấy session:", sessionError);
        return;
      }

      const userId = session?.session?.user?.id; // Lấy user ID từ session

      // Truy vấn bảng public.users để lấy thông tin người dùng
      const { data, error } = await supabase
        .from("users") // Truy vấn bảng public.users
        .select("*")
        .eq("id", userId) // Sử dụng userId trong truy vấn
        .single();

      if (data) {
        setUserInfo(data);
      } else {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
      setLoading(false);
    };

    fetchUserInfo();
  }, [supabase]);

  if (loading) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  if (!userInfo) {
    return <p>Không có thông tin người dùng.</p>;
  }

  // In trực tiếp dữ liệu JSON
  return (
    <pre>{JSON.stringify(userInfo, null, 2)}</pre>
  );
}
