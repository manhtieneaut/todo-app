"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import HomeContent from "../../component/HomeContent";

export default function HomePage() {
  
  useEffect(() => {
    const checkSession = async () => {
      const sessionToken = localStorage.getItem("jwt_token");

      // Nếu không có token, chuyển hướng tới trang đăng nhập
      if (!sessionToken) {
        redirect("/login");
      } else {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error || !session) {
          redirect("/login");
        }
      }
    };

    checkSession();
  }, []); // Chạy một lần khi component được render

  return (
    <div className="container mx-auto p-4">
       <HomeContent />
    </div>
  );
}
