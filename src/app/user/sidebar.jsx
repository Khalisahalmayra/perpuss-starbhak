"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) =>
    pathname === path ? "bg-gray-200" : "";

  return (
    <aside className="w-75 border-r border-gray-200 p-6 flex flex-col min-h-screen bg-white">
      
      <div className="flex items-center gap-3 mb-10">
        <Image src="/logo.png" alt="Logo" width={55} height={55} />
        <h1 className="font-bold text-sm whitespace-nowrap">
          PUSAT LITERASI STARBHAK
        </h1>
      </div>

      <div className="flex items-center gap-3 mb-10 p-3 bg-gray-100 rounded-lg">
        <Image
          src="/profile.jpg"
          alt="avatar"
          width={45}
          height={45}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-[14px]">Pham Hanni</p>
          <span className="text-[11px] bg-blue-600 text-white px-2 py-1 rounded">
            siswa
          </span>
        </div>
      </div>

      <nav className="space-y-2 flex-1 font-medium text-[15px]">
        
        <Link
          href="/user/home"
          className={`block py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/home")}`}
        >
          🏠 Beranda
        </Link>

        <Link
          href="/user/kategori"
          className={`block py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/kategori")}`}
        >
          📚 Kategori
        </Link>

        <Link
          href="/user/wishlist"
          className={`block py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/wishlist")}`}
        >
          ❤️ Wishlist
        </Link>

        <Link
          href="/user/notification"
          className={`block py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/notification")}`}
        >
          🔔 Notification
        </Link>

        <Link
          href="/user/riwayat"
          className={`block py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/riwayat")}`}
        >
          📝 Riwayat Peminjaman
        </Link>

      </nav>

      <Link href="/logout">
        <button className="flex items-center gap-3 text-red-500 font-semibold hover:text-red-600 mt-6 text-[15px] transition">
          🚪 Logout
        </button>
      </Link>

    </aside>
  );
}
