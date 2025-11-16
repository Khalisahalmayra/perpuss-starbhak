"use client";

import Link from "next/link";
import Image from "next/image";

export default function AdminSidebar() {
  return (
    <aside className="w-64 min-h-screen border-r border-gray-200 bg-white p-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Image
          src="/logo.png"
          alt="Logo"
          width={45}
          height={45}
          className="rounded-full"
        />
        <h1 className="text-sm font-semibold leading-tight">
          PUSAT LITERASI<br />STARBHAK
        </h1>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3 mb-10">
        <Image
          src="/profile.jpg"
          alt="profile"
          width={40}
          height={40}
          className="rounded-full"
        />
        <div>
          <p className="font-medium">Kim Jennie</p>
          <span className="text-xs bg-blue-500 text-white px-2 py-1 rounded">Admin</span>
        </div>
      </div>

      {/* Menu */}
      <nav className="space-y-4">
        <Link href="/admin/dashboard">
          <div className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer bg-gray-200">
            <span>📊</span>
            <p className="font-medium">Dashboard</p>
          </div>
        </Link>

        <Link href="/admin/buku">
          <div className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer">
            <span>📚</span>
            <p className="font-medium">Buku</p>
          </div>
        </Link>

        <Link href="/admin/logout">
          <div className="flex items-center gap-3 p-3 rounded hover:bg-gray-100 cursor-pointer">
            <span>🚪</span>
            <p className="font-medium">Logout</p>
          </div>
        </Link>
      </nav>
    </aside>
  );
}
