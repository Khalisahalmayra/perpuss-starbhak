"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { 
  Home, BookOpen, Heart, Bell, History, LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState(null);

  const isActive = (path) =>
    pathname === path ? "bg-gray-200" : "";

  useEffect(() => {
    const data = localStorage.getItem("user");
    if (data) setUser(JSON.parse(data));
  }, []);

  return (
    <aside className="w-75 border-r border-gray-200 p-6 flex flex-col min-h-screen bg-white">

      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <Image src="/logo.png" alt="Logo" width={55} height={55} />
        <h1 className="font-bold text-sm whitespace-nowrap">
          PUSAT LITERASI STARBHAK
        </h1>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-3 mb-10 p-3 bg-gray-100 rounded-lg">
        <Image
          src="/profile.jpg"
          alt="avatar"
          width={45}
          height={45}
          className="rounded-full"
        />
        <div>
          <p className="font-semibold text-[14px]">
            {user?.nama || "Loading..."}
          </p>
          <span className="text-[11px] bg-blue-600 text-white px-2 py-1 rounded">
            {user?.kelas || "Kelas tidak ada"}
          </span>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-2 flex-1 font-medium text-[15px]">

        <Link
          href="/user/home"
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/home")}`}
        >
          <Home size={18} /> Beranda
        </Link>

        <Link
          href="/user/kategori"
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/kategori")}`}
        >
          <BookOpen size={18} /> Kategori
        </Link>

        <Link
          href="/user/wishlist"
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/wishlist")}`}
        >
          <Heart size={18} /> Wishlist
        </Link>

        <Link
          href="/user/notification"
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/notification")}`}
        >
          <Bell size={18} /> Notification
        </Link>

        <Link
          href="/user/riwayat"
          className={`flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-gray-100 ${isActive("/user/riwayat")}`}
        >
          <History size={18} /> Riwayat Peminjaman
        </Link>

      </nav>

      <Link href="/auth/logout">
        <button className="flex items-center gap-2 text-red-500 font-semibold hover:text-red-600 mt-6 text-[15px] transition">
          <LogOut size={18} /> Logout
        </button>
      </Link>

    </aside>
  );
}
