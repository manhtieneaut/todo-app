// src/app/layout.tsx
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/component/Header";
import Footer from "@/component/Footer";
import Sidebar from "@/component/Sidebar";
import CheckAuth from "@/app/CheckAuth"; // Import CheckAuth component

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Sidebar />
        <div className="ml-0 md:ml-60">
          <Header />
          <main className="min-h-screen p-4">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
