"use client";

import { useEffect, useState } from "react";
import { IoSearch } from "react-icons/io5";
import { useParams } from "next/navigation";
import Sidebar from "../../sidebar";
import Image from "next/image";
import Link from "next/link";

export default function DetailBukuPage() {
  const { id } = useParams();
  const [buku, setBuku] = useState(null);
  const [loading, setLoading] = useState(true);

  // NOTIF STATE
  const [notif, setNotif] = useState({
    text: "",
    type: "", // success | error
  });

  useEffect(() => {
    const fetchBuku = async () => {
      try {
        const res = await fetch(`/api/buku/${id}`);
        const data = await res.json();
        setBuku(data);
      } catch (error) {
        console.error("Gagal memuat detail buku:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuku();
  }, [id]);

  if (loading) return <p className="p-8">Memuat detail buku...</p>;
  if (!buku) return <p className="p-8">Buku tidak ditemukan.</p>;

  // ------------------------------
  // ❤️  WISHLIST FUNCTION
  // ------------------------------
  const handleAddWishlist = () => {
    if (!buku || !buku.id) {
      setNotif({ text: "Data buku tidak valid!", type: "error" });
      return;
    }

    const wishlistItem = {
      id: buku.id,
      img: buku.img || "/default-book.png",
      title: buku.judul,
      author: buku.penulis,
      category: buku.kategori || "Umum",
    };

    let saved = [];
    if (typeof window !== "undefined") {
      saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    }

    const exist = saved.some((item) => item.id === wishlistItem.id);

    if (exist) {
      setNotif({ text: "Buku ini sudah ada di Wishlist!", type: "error" });
      return;
    }

    saved.push(wishlistItem);
    localStorage.setItem("wishlist", JSON.stringify(saved));

    setNotif({ text: "Buku berhasil ditambahkan ke Wishlist!", type: "success" });

    // Auto-hide notif
    setTimeout(() => {
      setNotif({ text: "", type: "" });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Search */}
        <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg px-3 py-2 mb-8">
          <input className="flex-1 outline-none text-sm" placeholder="Cari buku..." />
          <IoSearch className="text-lg" />
        </div>

        <div className="flex flex-col md:flex-row gap-10">
          {/* Gambar */}
          <div className="relative w-64 h-80 flex-shrink-0 border rounded-lg shadow-md overflow-hidden">
            <Image
              src={buku.img || "/default-book.png"}
              alt={buku.judul || "Gambar Buku"}
              fill
              unoptimized
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1">{buku.judul}</h1>
            <p className="text-gray-700 mb-2">{buku.penulis}</p>

            <span className="inline-block bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full mb-6">
              {buku.kategori || "-"}
            </span>

            {/* NOTIFIKASI */}
            {notif.text && (
              <div
                className={`p-3 mb-4 rounded-lg text-sm border ${
                  notif.type === "success"
                    ? "bg-green-100 text-green-700 border-green-300"
                    : "bg-red-100 text-red-700 border-red-300"
                }`}
              >
                {notif.text}
              </div>
            )}

            {/* Tabel Detail */}
            <div className="overflow-hidden rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-sm">
                <tbody>
                  <tr className="border-b">
                    <td className="p-2 font-medium w-1/3">Penerbit :</td>
                    <td className="p-2">{buku.penerbit || "-"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Tahun Terbit :</td>
                    <td className="p-2">{buku.tahun_terbit || "-"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Kategori :</td>
                    <td className="p-2">{buku.kategori || "-"}</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-2 font-medium">Stok :</td>
                    <td className="p-2">{buku.stok ?? "-"}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tombol */}
            <div className="flex justify-between mt-6">
              <button
                onClick={handleAddWishlist}
                className="px-5 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
              >
                + Tambah ke Wishlist
              </button>

              <Link
                href={`/user/detail/${buku.id}/pinjam`}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Pinjam Sekarang
              </Link>
            </div>
          </div>
        </div>

        {/* DESKRIPSI */}
        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-3">Deskripsi</h2>
          <p className="text-gray-700 leading-relaxed max-w-3xl">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi venenatis, lacus vel suscipit vehicula, lorem odio vehicula eros, eu porttitor nunc elit non tortor. Integer pulvinar, eros ut consequat vulputate, erat sapien maximus augue, et lacinia justo nibh non ipsum.
          </p>
        </div>
      </main>
    </div>
  );
}
