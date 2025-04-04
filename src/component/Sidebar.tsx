// @/component/Sidebar.tsx
import Link from "next/link";
import { Home, MessageCircle, Settings, CheckSquare ,Shield} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-gray-900 text-white p-6 z-40 shadow-lg hidden md:block">
      <div className="text-2xl font-bold mb-10">My App</div>
      <nav className="flex flex-col gap-4">
        <Link href="/" className="flex items-center gap-2 hover:text-blue-400 transition">
          <Home size={20} /> Home
        </Link>
        <Link href="/chat" className="flex items-center gap-2 hover:text-blue-400 transition">
          <MessageCircle size={20} /> Chat
        </Link>
        <Link href="/todos" className="flex items-center gap-2 hover:text-blue-400 transition">
          <CheckSquare size={20} /> Todos
        </Link>
        <Link href="/task" className="flex items-center gap-2 hover:text-blue-400 transition">
          <CheckSquare size={20} /> Tasks
        </Link>
        <Link href="/setting" className="flex items-center gap-2 hover:text-blue-400 transition">
          <Settings size={20} /> Settings
        </Link>
        {/* <Link href="/admin" className="flex items-center gap-2 hover:text-blue-400 transition">
          <Shield size={20} /> Admin
        </Link> */}
      </nav>
    </aside>
  );
}
