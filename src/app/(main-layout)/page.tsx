"use client";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen items-start justify-start text-left px-6 py-8">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Ngày 1 - Giới thiệu về Supabase và kiến trúc hệ thống</h1>
      <ul className="list-disc list-inside space-y-4">
        <li>
          <strong>Supabase là gì và hoạt động như thế nào:</strong> Supabase là một nền tảng Backend-as-a-Service (BaaS) mã nguồn mở, cung cấp các công cụ cần thiết để xây dựng ứng dụng web và di động. Nó tích hợp sẵn cơ sở dữ liệu PostgreSQL, xác thực người dùng, realtime (cập nhật dữ liệu theo thời gian thực) và lưu trữ tệp.
        </li>
        <li>
          <strong>So sánh Supabase với các nền tảng khác:</strong> So sánh Supabase với các đối thủ cạnh tranh như Firebase (của Google), Hasura (GraphQL API), Appwrite (BaaS mã nguồn mở), Backendless (BaaS) và Railway (nền tảng triển khai). Việc so sánh giúp hiểu rõ ưu và nhược điểm của từng nền tảng.
        </li>
        <li>
          <strong>Kiến trúc đa thuê bao (Multi-tenant) trên Supabase Cloud:</strong> Tìm hiểu cách Supabase Cloud hỗ trợ kiến trúc đa thuê bao, cho phép nhiều khách hàng sử dụng cùng một ứng dụng nhưng dữ liệu được phân tách an toàn. Row-Level Security (RLS) là một tính năng quan trọng để quản lý quyền truy cập dữ liệu trong môi trường đa thuê bao.
        </li>
        <li>
          <strong>Cấu trúc tổ chức dự án: API-first vs DB-first:</strong> Thảo luận về hai phương pháp tiếp cận thiết kế dự án: API-first (thiết kế API trước khi xây dựng cơ sở dữ liệu) và DB-first (thiết kế cơ sở dữ liệu trước). Mỗi phương pháp có những ưu và nhược điểm riêng.
        </li>
      </ul>

      <h1 className="text-3xl font-bold mb-6 text-blue-600">Ngày 2 - Thiết kế cơ sở dữ liệu và tối ưu hóa</h1>
      <ul className="list-disc list-inside space-y-4">
        <li>
          <strong>Thiết kế schema: Chuẩn hóa vs phi chuẩn hóa:</strong> Phân tích ưu và nhược điểm của việc chuẩn hóa (normalization) và phi chuẩn hóa (denormalization) trong thiết kế cơ sở dữ liệu. Chuẩn hóa giúp giảm dư thừa dữ liệu, trong khi phi chuẩn hóa giúp tăng hiệu suất truy vấn trong một số trường hợp.
        </li>
        <li>
          <strong>Các loại quan hệ trong cơ sở dữ liệu:</strong> Hiểu rõ các loại quan hệ 1-n (một-nhiều) và n-n (nhiều-nhiều) trong cơ sở dữ liệu quan hệ. Soft delete là kỹ thuật đánh dấu bản ghi là đã xóa thay vì xóa hẳn, còn versioning là kỹ thuật theo dõi các phiên bản thay đổi của bản ghi.
        </li>
        <li>
          <strong>Tối ưu hóa cơ sở dữ liệu:</strong> Học cách tối ưu hóa index (chỉ mục) để tăng tốc độ truy vấn, sử dụng full-text search (tìm kiếm toàn văn bản) để tìm kiếm hiệu quả trong dữ liệu văn bản và các kỹ thuật tối ưu hóa khác.
        </li>
        <li>
          <strong>Row-Level Security (RLS) và Policy Design Patterns:</strong> Nắm vững cách thiết lập RLS để kiểm soát quyền truy cập dữ liệu ở cấp độ hàng (row) và các mẫu thiết kế chính sách bảo mật (policy design patterns) trong Supabase.
        </li>
      </ul>

      <h1 className="text-3xl font-bold mb-6 text-blue-600">Ngày 3 - Xác thực người dùng và quản lý quyền truy cập</h1>
      <ul className="list-disc list-inside space-y-4">
        <li>
          <strong>Hoạt động của Supabase Auth qua GoTrue:</strong> Tìm hiểu cách Supabase sử dụng GoTrue, một máy chủ xác thực mã nguồn mở, để cung cấp dịch vụ xác thực người dùng.
        </li>
        <li>
          <strong>Quản lý session và token refresh:</strong> Hiểu cách quản lý phiên làm việc (session) và làm mới token (token refresh) để duy trì trạng thái đăng nhập của người dùng.
        </li>
        <li>
          <strong>Các phương thức xác thực:</strong> So sánh các phương thức xác thực người dùng như email/password, magic link (liên kết đăng nhập qua email) và OAuth (xác thực thông qua bên thứ ba như Google, Facebook).
        </li>
        <li>
          <strong>Role-Based Access Control (RBAC):</strong> Nắm vững cách thiết lập và quản lý quyền truy cập dựa trên vai trò (role) của người dùng, cho phép phân quyền chi tiết trong ứng dụng.
        </li>
      </ul>

      <h1 className="text-3xl font-bold mb-6 text-blue-600">Ngày 4 - Realtime Subscriptions và Edge Functions</h1>
      <ul className="list-disc list-inside space-y-4">
        <li>
          <strong>Hoạt động của `supabase.realtime`:</strong> Tìm hiểu cách Supabase cung cấp khả năng cập nhật dữ liệu theo thời gian thực (realtime) thông qua `supabase.realtime`, cho phép ứng dụng phản hồi ngay lập tức với các thay đổi dữ liệu.
        </li>
        <li>
          <strong>So sánh Edge Functions và traditional backend API:</strong> Đánh giá ưu và nhược điểm của việc sử dụng Edge Functions (hàm chạy ở biên mạng, gần người dùng) so với API backend truyền thống (chạy trên máy chủ tập trung).
        </li>
        <li>
          <strong>Websocket và CRDT considerations:</strong> Hiểu về Websocket (giao thức giao tiếp hai chiều) và các yếu tố cần xem xét khi làm việc với Conflict-free Replicated Data Types (CRDT), một kỹ thuật quản lý dữ liệu đồng bộ trong môi trường realtime.
        </li>
      </ul>

      <h1 className="text-3xl font-bold mb-6 text-blue-600">Ngày 5 - Lưu trữ tệp và quản lý metadata</h1>
      <ul className="list-disc list-inside space-y-4">
        <li>
          <strong>Hoạt động của Supabase Storage và cấu trúc Bucket:</strong> Tìm hiểu cách Supabase quản lý lưu trữ tệp (storage) và tổ chức dữ liệu trong các bucket (thùng chứa).
        </li>
        <li>
          <strong>Xác thực truy cập tệp:</strong> Học cách sử dụng signed URL (URL được ký) và RLS để kiểm soát quyền truy cập vào tệp, đảm bảo an toàn cho dữ liệu.
        </li>
        <li>
          <strong>Quản lý metadata:</strong> Khám phá cách xử lý metadata (dữ liệu về dữ liệu) của tệp, bao gồm EXIF (thông tin về ảnh), thông tin PDF và sử dụng OCR (nhận dạng ký tự quang học) để trích xuất văn bản từ hình ảnh.
        </li>
      </ul>

      <h1 className="text-3xl font-bold mb-6 text-blue-600">Ngày 6 - Tích hợp frontend và triển khai CI/CD</h1>
      <ul className="list-disc list-inside space-y-4">
        <li>
          <strong>Kết nối Supabase với các framework frontend:</strong> Hướng dẫn cách tích hợp Supabase với các framework frontend phổ biến như Next.js, React, Vue và Flutter.
        </li>
        <li>
          <strong>Quản lý trạng thái ứng dụng:</strong> Giới thiệu về các thư viện quản lý trạng thái (state management) như React Query và Zustand, giúp quản lý dữ liệu trong ứng dụng frontend một cách hiệu quả.
        </li>
        <li>
          <strong>Thiết lập CI/CD với GitHub Actions:</strong> Hướng dẫn cách thiết lập pipeline CI/CD (Continuous Integration/Continuous Deployment) với GitHub Actions để tự động hóa quy trình triển khai ứng dụng.
        </li>
      </ul>
    </div>
  );
}
