"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import Header from "@/components/Header"; // Import Header Component
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link"; // Import Link từ next/link
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen bg-gray-100">
          <div className="w-64 bg-gray-800 text-white p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center text-purple-500">Logo</h1>
            <ul className="space-y-4">
              <li>
                <Link href="/" className="block text-lg hover:bg-gray-700 p-2 rounded-md">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link href="/profile" className="block text-lg hover:bg-gray-700 p-2 rounded-md">
                  Hồ sơ
                </Link>
              </li>
              <li>
                <Link href="/settings" className="block text-lg hover:bg-gray-700 p-2 rounded-md">
                  Cài đặt
                </Link>
              </li>
              <li>
                <Link href="/chat" className="block text-lg hover:bg-gray-700 p-2 rounded-md">
                  Nhắn tin
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex-1 flex flex-col">
            <Header />
            <main className="flex-1 p-8">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
