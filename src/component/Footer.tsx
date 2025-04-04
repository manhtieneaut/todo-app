// @/component/Footer.tsx

export default function Footer() {
    return (
      <footer className="bg-gray-900 text-white py-6 mt-10">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm sm:text-base">
            &copy; 2025 <span className="font-semibold text-blue-400">My Next.js App</span>. All Rights Reserved.
          </p>
          <div className="mt-2 flex justify-center gap-4 text-sm text-gray-400">
            <a href="/privacy" className="hover:text-white transition">Privacy Policy</a>
            <span>|</span>
            <a href="/terms" className="hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </footer>
    );
  }
  