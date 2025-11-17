"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PinjamBukuPage() {
  const { id } = useParams();
  const router = useRouter();

  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hari, setHari] = useState(7);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/buku/${id}`);
        const data = await res.json();
        setBuku(data);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-8">Memuat data...</p>;
  if (!buku) return <p className="p-8">Buku tidak ditemukan.</p>;

  const today = new Date();
  const formattedToday = today.toLocaleDateString("id-ID");

  const batasWaktu = new Date(today);
  batasWaktu.setDate(today.getDate() + hari);
  const formattedBatas = batasWaktu.toLocaleDateString("id-ID");

  const handleKonfirmasi = async () => {
    try {
      const res = await fetch("/api/peminjaman", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: 1, 
          buku_id: buku.id,
          tanggal_pinjam: today.toISOString().split("T")[0],
          lama_pinjam: hari,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.log("Gagal mengajukan peminjaman:", data.message);
        return;
      }

      const dataPinjam = {
        id: buku.id,
        img: buku.img || "/default-book.png",
        title: buku.judul,
        author: buku.penulis,
        tanggalPinjam: formattedToday,
        batasKembali: formattedBatas,
        hariPeminjaman: hari,
        status: "pending",
      };

      const riwayat = JSON.parse(localStorage.getItem("riwayat_pinjam") || "[]");
      riwayat.unshift(dataPinjam);
      localStorage.setItem("riwayat_pinjam", JSON.stringify(riwayat));

      const notifikasi = {
        id: buku.id,
        img: buku.img || "/default-book.png",
        title: buku.judul,
        author: buku.penulis,
        message: `Peminjaman buku "${buku.judul}" sedang menunggu persetujuan admin.`,
        tanggal: formattedToday,
        batasKembali: formattedBatas,
        type: "pending",
      };

      const notifList = JSON.parse(localStorage.getItem("notifikasi_pinjam") || "[]");
      notifList.unshift(notifikasi);
      localStorage.setItem("notifikasi_pinjam", JSON.stringify(notifList));

      router.push("/user/riwayat?status=success");

    } catch (error) {
      console.error("Terjadi kesalahan:", error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-start p-10">
      <div className="flex gap-12 max-w-4xl w-full">

        <Image
          src={buku.img || "/default-book.png"}
          width={300}
          height={320}
          unoptimized
          alt="cover"
          className="rounded-lg shadow-md"
        />

        <div className="max-w-lg text-[14px] leading-relaxed">
          <h2 className="text-xl font-bold mb-1">{buku.judul}</h2>
          <p className="text-gray-600 mb-4">{buku.penulis}</p>

          <div className="mt-6 space-y-4">
            <p><strong>Waktu Peminjaman</strong> : {formattedToday}</p>

            <div>
              <p><strong>Pilih Batas Waktu Peminjaman:</strong></p>
              <select
                value={hari}
                onChange={(e) => setHari(Number(e.target.value))}
                className="border border-gray-400 px-3 py-1 rounded mt-1"
              >
                {[7, 10, 14, 20].map((n) => (
                  <option key={n} value={n}>{n} hari</option>
                ))}
              </select>
              <p className="text-[12px] text-red-600 mt-1">
                MAKSIMAL PEMINJAMAN 20 HARI
              </p>
            </div>

            <p><strong>Batas Waktu Pengembalian:</strong> {formattedBatas}</p>

            <div className="text-[12px] mt-4 text-red-700">
              <p>Denda telat: <strong>Rp50.000</strong></p>
              <p>Denda hilang: <strong>Rp350.000</strong></p>
            </div>

            <div className="flex gap-4 mt-8">
              <Link
                href={`/user/detail/${id}`}
                className="border border-gray-500 px-4 py-2 rounded hover:bg-gray-200"
              >
                Kembali
              </Link>

              <button
                onClick={handleKonfirmasi}
                className="bg-[#5D80B6] text-white px-4 py-2 rounded hover:bg-[#4a6a99]"
              >
                Konfirmasi Peminjaman
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
