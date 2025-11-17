"use client";

import { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";

export default function NotificationPage() {
  const [notifList, setNotifList] = useState([]);

  const convertToISO = (tgl) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(tgl)) return tgl;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(tgl)) {
      const [d, m, y] = tgl.split("/");
      return `${y}-${m}-${d}`;
    }

    return tgl;
  };

  useEffect(() => {
    const riwayat = JSON.parse(localStorage.getItem("riwayat_pinjam") || "[]");
    const notifikasi = JSON.parse(localStorage.getItem("notifikasi_pinjam") || "[]");

    const today = new Date();
    let newNotif = [...notifikasi]; 

    riwayat.forEach((item) => {
      const iso = convertToISO(item.batasKembali);
      const batas = new Date(iso + "T00:00:00");

      const diffMs = batas - today;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays <= 2 && diffDays >= 0) {
        const sudahAda = newNotif.some(
          (n) => n.type === "reminder" && n.id === item.id
        );

        if (!sudahAda) {
          newNotif.unshift({
            id: item.id,
            img: item.img,
            title: item.title,
            author: item.author,
            type: "reminder",
            tanggal: today.toLocaleDateString("id-ID"),
            batasKembali: item.batasKembali,
            message: `Waktu pengembalian buku "${item.title}" tinggal ${diffDays} hari lagi!`,
          });
        }
      }
    });

    localStorage.setItem("notifikasi_pinjam", JSON.stringify(newNotif));
    setNotifList(newNotif);

  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-6">

        <div className="flex items-center w-full max-w-lg border border-gray-300 rounded-lg px-3 py-2 mb-8">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none text-sm"
          />
          <IoSearch className="text-lg" />
        </div>

        {notifList.length === 0 && (
          <p className="text-gray-600">Belum ada notifikasi peminjaman.</p>
        )}

        {notifList.map((item, index) => (
          <div key={index} className="flex gap-5 items-start mb-8">

            <Image
              src={item.img || "/default-book.png"}
              width={110}
              height={160}
              alt="Cover Buku"
              className="rounded-lg shadow"
              unoptimized
            />

            <div className="leading-relaxed text-sm">
              <h3 className="font-semibold text-[16px]">{item.title}</h3>
              <p className="text-gray-600">{item.author || "Tidak ada pengarang"}</p>

              <p className="mt-2 text-gray-700">{item.message}</p>

              <p className="mt-3 text-green-600 font-semibold">
                TANGGAL PEMINJAMAN: {item.tanggal}
              </p>

              <p className="text-red-500 font-semibold">
                BATAS PENGEMBALIAN: {item.batasKembali}
              </p>

              <span
                className={`inline-block px-3 py-1 mt-2 text-xs rounded-full text-white ${
                  item.type === "pending"
                    ? "bg-yellow-500"
                    : item.type === "reminder"
                    ? "bg-red-600"
                    : "bg-blue-500"
                }`}
              >
                {item.type.toUpperCase()}
              </span>
            </div>
          </div>
        ))}

      </main>
    </div>
  );
}
