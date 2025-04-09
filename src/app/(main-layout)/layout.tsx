"use client";

import { useState, useRef, useEffect } from "react";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuthStore } from "@/store/auth";
import { useProfileStore } from "@/store/profile";
import { getUserInfo } from "@/api/profileApi";
import AuthGuard from "@/component/AuthGuard";
import {
  Home,
  User,
  MessageSquare,
  ClipboardList,
} from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, setCurrentUser } = useAuthStore();
  const { userInfo, setUserInfo, setLoading } = useProfileStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const initUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setCurrentUser({ id: user.id, email: user.email! });

        try {
          setLoading(true);
          const profile = await getUserInfo();
          setUserInfo(profile);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!currentUser) initUser();
  }, [currentUser]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setUserInfo(null);
    localStorage.removeItem("jwt_token");
    router.push("/login");
  };

  const breadcrumb = pathname
    .split("/")
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");

    const [userRole, setUserRole] = useState<string | null>(null);

    useEffect(() => {
      const storedRole = localStorage.getItem('user_role');
      setUserRole(storedRole);
    }, []);

    const menu = [
      { label: "Home", icon: <Home size={18} />, href: "/" },
      { label: "Profile", icon: <User size={18} />, href: "/profile" },
      { label: "Chats", icon: <MessageSquare size={18} />, href: "/chat" },
      { label: "Tasks", icon: <ClipboardList size={18} />, href: "/task" },
      ...(userRole === "admin"
        ? [{ label: "Admin", icon: <ClipboardList size={18} />, href: "/admin" }]
        : []),
    ];
    

  return (
    <AuthGuard>
      <div className="flex h-screen bg-gray-100 text-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r shadow-md p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-purple-600 mb-10 tracking-tight">MyApp</h2>
            <nav className="flex flex-col gap-3">
              {menu.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium hover:bg-purple-100 transition ${pathname === item.href ? "bg-purple-100 text-purple-700" : "text-gray-700"
                    }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main layout */}
        <div className="flex-1 flex flex-col">

          {/* Header */}
          <header className="bg-white border-b shadow-sm px-6 py-4 flex items-center justify-between relative">
            <h1 className="text-lg font-semibold text-gray-800">{breadcrumb || "Dashboard"}</h1>
            <div className="flex items-center gap-3 relative">
              <span className="text-sm text-gray-600 hidden sm:block">{currentUser?.email}</span>

              <img
                onClick={toggleDropdown}
                src={userInfo?.avatar_url || "/default-avatar.png"}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover hover:ring-2 hover:ring-purple-300 transition cursor-pointer"
              />

              {isDropdownOpen && (
                <div className="absolute top-12 right-0 w-44 bg-white border rounded-md shadow-lg z-50">
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      handleLogout();
                      setIsDropdownOpen(false);
                    }}
                  >
                    Logout
                  </Link>
                  <Link
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-500 hover:bg-gray-100"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDropdownOpen(false);
                    }}
                  >
                    Close
                  </Link>
                </div>
              )}

            </div>
          </header>
          {/* Main content */}
          <main className="flex-1 overflow-y-auto p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
