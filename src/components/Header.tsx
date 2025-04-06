'use client';

import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient'; // Đường dẫn đến tệp supabaseClient.ts

export default function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/auth'); // Chuyển hướng về trang đăng nhập
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-800">Ứng Dụng</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Log Out
      </button>
    </header>
  );
}