"use client";

import { useEffect, useState } from "react";
import Sidebar from "../sidebar";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";

export default function RiwayatPage() {
  const [riwayatData, setRiwayatData] = useState([]);
  const [loading, setLoading] = useState(true);

  const convertToISO = (tgl) => {
    if (/^\d{4}-\d{2}-\d{2}$/.test(tgl)) return tgl;

    if (/^\d{2}\/\d{2}\/\d{4}$/.test(tgl)) {
      const [d, m, y] = tgl.split("/");
      return `${y}-${m}-${d}`;
    }

    return tgl;
  };

  useEffect(() => {
    const fetchRiwayat = async () => {
      try {
        // Ambil user yang login
        const userStr = localStorage.getItem("user");
        if (!userStr) {
          console.log("User belum login");
          setLoading(false);
          return;
        }

        const currentUser = JSON.parse(userStr);
        console.log("👤 Current user:", currentUser);

        // Fetch data dari API
        const res = await fetch("/api/peminjaman", {
          cache: "no-store",
        });

        if (!res.ok) {
          console.error("Gagal fetch data");
          setLoading(false);
          return;
        }

        const allData = await res.json();
        console.log("📚 All data:", allData);

        // Filter hanya peminjaman user yang login
        const userPeminjaman = allData.filter(
          (item) => item.user_id === currentUser.id
        );

        console.log("✅ User peminjaman:", userPeminjaman);

        // Hitung sisa hari
        const updated = userPeminjaman.map((item) => {
          const today = new Date();
          const iso = convertToISO(item.tanggal_kembali);
          const batas = new Date(iso + "T00:00:00");

          const diffMs = batas - today;
          const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

          return {
            id: item.id,
            img: item.buku_img || "/default-book.png",
            title: item.buku_judul,
            author: item.buku_penulis || "-",
            tanggalPinjam: new Date(item.tanggal_pinjam).toLocaleDateString("id-ID"),
            batasKembali: new Date(item.tanggal_kembali).toLocaleDateString("id-ID"),
            status: item.status,
            sisaHari: diffDays >= 0 ? diffDays : 0,
          };
        });

        setRiwayatData(updated);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRiwayat();
  }, []);

  const StatusBadge = ({ status }) => {
    let color = "bg-gray-400";

    if (status === "pending") color = "bg-yellow-400 text-black";
    if (status === "dipinjam") color = "bg-blue-500 text-white";
    if (status === "ditolak") color = "bg-red-500 text-white";
    if (status === "dikembalikan") color = "bg-green-500 text-white";

    return (
      <span className={`px-3 py-1 text-xs rounded-full font-semibold ${color}`}>
        {status.toUpperCase()}
      </span>
    );
  };

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

        {loading && (
          <p className="text-gray-600">Memuat riwayat peminjaman...</p>
        )}

        {!loading && riwayatData.length === 0 && (
          <p className="text-gray-600">Belum ada riwayat peminjaman.</p>
        )}

        {riwayatData.map((item, index) => (
          <div key={index} className="flex gap-5 items-start mb-8">

            <Image
              src={item.img}
              width={110}
              height={160}
              alt="Cover Buku"
              className="rounded-lg shadow"
              unoptimized
            />

            <div className="leading-relaxed text-sm">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="font-semibold text-[16px]">{item.title}</h3>

                <StatusBadge status={item.status} />
              </div>

              <p className="text-gray-600">{item.author}</p>

              <p className="mt-2 text-gray-700">
                KAMU MEMINJAM BUKU{" "}
                <span className="font-semibold">{item.title}</span>
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