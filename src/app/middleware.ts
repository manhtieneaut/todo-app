// middleware.ts (vẫn sử dụng cookies)
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

// Kiểm tra token JWT trong cookies
export function middleware(request: NextRequest) {
  const token = request.cookies.get("jwt_token"); // Lấy JWT từ cookies

  if (!token) {
    // Nếu không có token, chuyển hướng đến trang login
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Nếu có token, cho phép truy cập trang
  return NextResponse.next();
}

// Cấu hình đường dẫn cần bảo vệ
export const config = {
  matcher: ["/protected/*"],  // Cách match các route cần bảo vệ
};
