import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Nội dung chính */}
      <main className="flex-grow grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div className="flex flex-col items-center justify-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.svg"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <h1 className="text-3xl font-bold">My Website</h1>
          </Link>
          <p className="text-gray-500">Welcome to my website!</p>
        </div>

        <div className="flex flex-col items-center justify-center gap-4">
          <h2 className="text-2xl font-semibold">Main Content</h2>
          <p>This is the main content area.</p>

          <Link href="/login" className="text-blue-500 hover:underline">
            Login
          </Link>

          <Link href="/register" className="text-blue-500 hover:underline">
            Register
          </Link>

          <Link href="/home" className="text-blue-500 hover:underline">
            Home
          </Link>

          <Link href="/about" className="text-blue-500 hover:underline">
            About
          </Link>

        </div>
      </main>

      {/* Footer */}
    </div>
  );
}
