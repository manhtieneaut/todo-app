// app/page.tsx
import { createServerSupabaseClient } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const supabase = await createServerSupabaseClient();

  // Lấy session từ Supabase
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  // Kiểm tra session và chuyển hướng nếu không có session
  if (error || !session) {
    redirect("/auth");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
     
      {/* Nội dung chính */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold">Trang Chính</h1>
        <p className="mt-4">Chào mừng bạn đến với trang chính của ứng dụng!</p>
        <p className="mt-2">Đây là nơi bạn có thể tìm thấy thông tin và chức năng chính của ứng dụng.</p>
      </div>
    </div>
  );
}
