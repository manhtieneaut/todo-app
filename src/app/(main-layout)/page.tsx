"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function HomePage({ children }: { children: React.ReactNode }) {
  
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
    <div className="container mx-auto p-4">
       <h1>Trang chủ</h1>
    </div>
  );
}
