"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();

  // Tách path để tạo breadcrumb
  const pathSegments = pathname.split("/").filter(Boolean);

  return (
    <header className="bg-blue-200 py-4">
      <div className="container mx-auto px-8 flex justify-between items-center">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-700">
          <Breadcrumb segments={pathSegments} />
        </div>

        {/* Navigation Menu */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/login" className="hover:text-blue-700">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

function Breadcrumb({ segments }: { segments: string[] }) {
  return (
    <nav className="text-sm">
      <Link href="/" className="text-blue-600 hover:underline">Home</Link>
      {segments.map((segment, index) => {
        const href = "/" + segments.slice(0, index + 1).join("/");
        const label = segment.charAt(0).toUpperCase() + segment.slice(1);
        return (
          <span key={href}>
            <span className="mx-1">›</span>
            <Link href={href} className="text-blue-600 hover:underline">{label}</Link>
          </span>
        );
      })}
    </nav>
  );
}
