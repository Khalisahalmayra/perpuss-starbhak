"use client";

import { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";

export default function NotificationPage() {
  const [notifList, setNotifList] = useState([]);

  useEffect(() => {
    // Ambil data dari localStorage
    const data = JSON.parse(localStorage.getItem("notifikasi_pinjam") || "[]");
    console.log("DATA NOTIF :", data); // Cek data yang masuk

    setNotifList(data);
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-6">
        
        {/* Search Bar */}
        <div className="flex items-center w-full max-w-lg border border-gray-300 rounded-lg px-3 py-2 mb-8">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none text-sm"
          />
          <IoSearch className="text-lg" />
        </div>

        {/* Jika Tidak Ada Notifikasi */}
        {notifList.length === 0 && (
          <p className="text-gray-600">Belum ada notifikasi peminjaman.</p>
        )}

        {/* List Notifikasi */}
        {notifList.map((item, index) => (
          <div key={index} className="flex gap-5 items-start mb-8">
            
            {/* FIX GAMBAR TIDAK MUNCUL */}
            <Image
              src={item.img || "/default-book.png"}
              width={110}
              height={160}
              alt="Cover Buku"
              className="rounded-lg shadow"
              unoptimized   // ⬅️ FIX TERPENTING AGAR LINK / LOCALSTORAGE MAU MUNCUL
            />

            <div className="leading-relaxed text-sm">
              <h3 className="font-semibold text-[16px]">{item.title}</h3>

              <p className="text-gray-600">
                {item.author || "Tidak ada pengarang"}
              </p>

              <p className="mt-2 text-gray-700">{item.message}</p>

              <p className="mt-3 text-green-600 font-semibold">
                TANGGAL PEMINJAMAN: {item.tanggal}
              </p>

              <p className="text-red-500 font-semibold">
                BATAS PENGEMBALIAN: {item.batasKembali}
              </p>
            </div>

          </div>
        ))}

      </main>
    </div>
  );
}
