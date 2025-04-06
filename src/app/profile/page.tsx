"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ProfilePage() {
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserInfo = async () => {
      // Lấy user hiện tại từ Supabase (nó sẽ lấy từ bộ nhớ cache/session local)
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error("Không thể lấy thông tin người dùng:", userError);
        alert("Bạn cần đăng nhập!");
        setLoading(false);
        return;
      }

      // Truy vấn bảng profiles (hoặc users tùy bạn) để lấy thêm thông tin
      const { data, error } = await supabase
        .from("users") // Đổi lại đúng tên bảng bạn đang dùng
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Lỗi khi truy vấn thông tin người dùng:", error);
      } else {
        setUserInfo(data);
      }

      setLoading(false);
    };

    fetchUserInfo();
  }, []);

  if (loading) {
    return <p>Đang tải thông tin người dùng...</p>;
  }

  if (!userInfo) {
    return <p>Không tìm thấy thông tin người dùng.</p>;
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-md">
      <h1 className="text-2xl font-bold mb-4">Thông tin người dùng</h1>
      <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto">
        {JSON.stringify(userInfo, null, 2)}
      </pre>
    </div>
  );
}
