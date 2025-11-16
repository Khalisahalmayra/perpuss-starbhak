"use client";

import { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";

export default function RiwayatPage() {
  const [riwayatData, setRiwayatData] = useState([]);

  const convertToISO = (tgl) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(tgl)) return tgl;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(tgl)) {
      const [d, m, y] = tgl.split("/");
      return `${y}-${m}-${d}`;
    }

    return tgl;
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("riwayat_pinjam") || "[]");

    const updated = data.map((item) => {
      const today = new Date();
      const iso = convertToISO(item.batasKembali);
      const batas = new Date(iso + "T00:00:00");

      const diffMs = batas - today;
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      return {
        ...item,
        sisaHari: diffDays >= 0 ? diffDays : 0,
      };
    });

    setRiwayatData(updated);
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

        {riwayatData.length === 0 && (
          <p className="text-gray-600">Belum ada riwayat peminjaman.</p>
        )}

        {riwayatData.map((item, index) => (
          <div key={index} className="flex gap-5 items-start mb-8">

            {/* FIX GAMBAR — WAJIB ADA unoptimized */}
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
              <p className="text-gray-600">{item.author}</p>

              <p className="mt-2 text-gray-700">
                KAMU MEMINJAM BUKU <span className="font-semibold">{item.title}</span>
              </p>

              <p className="mt-3 text-green-600 font-semibold">
                TANGGAL PEMINJAMAN {item.tanggalPinjam}
              </p>

              <p className="text-red-500 font-semibold">
                BATAS PENGEMBALIAN {item.batasKembali} ({item.sisaHari} HARI TERSISA)
              </p>
            </div>

          </div>
        ))}
      </main>
    </div>
  );
}
