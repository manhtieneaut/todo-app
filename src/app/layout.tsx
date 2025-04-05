import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <div className="flex min-h-screen bg-gray-100">
          {/* Sidebar */}
          <div className="w-64 bg-gray-800 text-white p-6 space-y-6">
            <h1 className="text-2xl font-bold text-center text-purple-500">Logo</h1>
            <ul className="space-y-4">
              <li>
                <a href="/" className="block text-lg hover:bg-gray-700 p-2 rounded-md">Trang chủ</a>
              </li>
              <li>
                <a href="/profile" className="block text-lg hover:bg-gray-700 p-2 rounded-md">Hồ sơ</a>
              </li>
              <li>
                <a href="/settings" className="block text-lg hover:bg-gray-700 p-2 rounded-md">Cài đặt</a>
              </li>
              <li>
                <a href="/chat" className="block text-lg hover:bg-gray-700 p-2 rounded-md">Nhắn tin</a>
              </li>
            </ul>
          </div>

          {/* Nội dung chính */}
          <div className="flex-1 p-8">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
