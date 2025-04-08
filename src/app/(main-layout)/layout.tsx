"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { usePathname } from "next/navigation";

export default function MainLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<any | null>(null);
  const [userInfo, setUserInfo] = useState<any | null>(null);
  const pathname = usePathname(); // Lấy đường dẫn hiện tại

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("full_name, avatar_url")
          .eq("id", user.id)
          .single();

        if (!error) {
          setUserInfo(data);
        }
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setUserInfo(null);
  };

  // Chuyển đường dẫn thành breadcrumb
  const breadcrumb = pathname
    .split("/")
    .filter((segment) => segment) // Loại bỏ các phần tử rỗng
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1)) // Viết hoa chữ cái đầu
    .join(" > ");

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 text-gray-800 flex flex-col p-4 shadow-md">
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <nav className="flex flex-col gap-4">
          <Link href="/" className="hover:text-blue-500">Home</Link>
          <Link href="/profile" className="hover:text-blue-500">Profile</Link>
          <Link href="/chat" className="hover:text-blue-500">Chats</Link>
          <Link href="/task" className="hover:text-blue-500">Tasks</Link>
          <Link href="/todos" className="hover:text-blue-500">Todos</Link>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white text-gray-800 p-4 flex justify-between items-center shadow-md">
          <h1 className="text-lg font-bold">{breadcrumb || "Home"}</h1>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                {/* Hiển thị avatar */}
                <Link href="/profile">
                  <img
                    src={userInfo?.avatar_url || "/default-avatar.png"}
                    alt="Avatar"
                    className="w-10 h-10 rounded-full object-cover border cursor-pointer"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="bg-blue-500 px-4 py-2 rounded hover:bg-blue-600 transition text-white">
                  Login
                </button>
              </Link>
            )}
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 p-6 overflow-auto bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
}
