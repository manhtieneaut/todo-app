// src/app/CheckAuth.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const CheckAuth = () => {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access_token");

    // Nếu không có access_token, chuyển hướng tới trang login
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return null; // Component này không cần render gì cả
};

export default CheckAuth;
