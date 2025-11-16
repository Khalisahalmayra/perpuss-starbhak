"use client";

import Sidebar from "../sidebar";
import Image from "next/image";
import Link from "next/link";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";

export default function KategoriPage() {
  const [bukuList, setBukuList] = useState([]);
  const [filteredBuku, setFilteredBuku] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState("Semua");
  const [kategoriList, setKategoriList] = useState([]);

  // 🔹 Ambil kategori dari database
  useEffect(() => {
    const fetchKategori = async () => {
      const res = await fetch("/api/kategori");
      const data = await res.json();

      const mapped = data.map((item) => ({
        name: item.kategori,
        img: "/kategori/default.png",
      }));

      setKategoriList([{ name: "Semua", img: "/kategori/semua.png" }, ...mapped]);
    };

    fetchKategori();
  }, []);

  // 🔹 Ambil data buku dari database
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("/api/buku");
        const data = await res.json();
        setBukuList(data);
        setFilteredBuku(data);
      } catch (error) {
        console.error("Gagal mengambil data buku:", error);
      }
    };
    fetchData();
  }, []);

  // 🔹 Filter buku berdasarkan kategori
  const handleFilter = (kategori) => {
    setSelectedKategori(kategori);

    if (kategori === "Semua") {
      setFilteredBuku(bukuList);
      return;
    }

    const filtered = bukuList.filter(
      (b) =>
        b.kategori?.toLowerCase().replace("-", "").trim() ===
        kategori.toLowerCase().replace("-", "").trim()
    );

    setFilteredBuku(filtered);
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-6 flex flex-col gap-6">
        
        {/* 🔍 Search Bar */}
        <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg px-3 py-2">
          <input
            type="text"
            placeholder="Cari buku..."
            className="flex-1 outline-none text-sm"
          />
          <IoSearch className="text-lg" />
        </div>

        {/* 📚 Daftar Kategori Utama */}
        <div className="flex gap-4 overflow-x-auto pb-4">
          {kategoriList.map((kat, i) => (
            <button
              key={i}
              onClick={() => handleFilter(kat.name)}
              className={`flex flex-col items-center justify-center text-white px-4 py-3 rounded-lg text-xs transition ${
                selectedKategori === kat.name
                  ? "bg-[#48689a]"
                  : "bg-[#5D80B6] hover:bg-[#48689a]"
              }`}
            >
              <Image
                src={kat.img}
                width={28}
                height={28}
                alt={kat.name}
                className="object-contain"
              />
              <span className="mt-1 whitespace-nowrap">{kat.name}</span>
            </button>
          ))}
        </div>

        {/* 📖 Koleksi Buku */}
        <section className="bg-white pt-4">

          {/* 🔥 Kategori Buku */}
          <div className="flex gap-3 mb-4">
            {["Pelajaran", "Fiksi", "Non-Fiksi", "Novel"].map((kat) => (
              <button
                key={kat}
                onClick={() => handleFilter(kat)}
                className={`px-4 py-2 text-sm rounded-lg border transition ${
                  selectedKategori === kat
                    ? "bg-[#48689a] text-white border-[#48689a]"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {kat}
              </button>
            ))}
          </div>

          <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2 mb-3">
            <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            Koleksi Buku Terpopuler
          </h2>

          {filteredBuku.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {filteredBuku.slice(0, 20).map((book) => (
                <Link
                  key={book.id}
                  href={`/user/detail/${book.id}`}
                  className="bg-white rounded-xl shadow hover:shadow-md transition p-3 flex flex-col"
                >
                  <div className="w-full h-48 relative">

                    {/* FIX UTAMA: unoptimized + fallback */}
                    <Image
                      src={book.img || "/no-image.png"}
                      alt={book.judul}
                      fill
                      unoptimized
                      className="rounded-lg object-cover"
                    />
                  </div>

                  <p className="mt-2 text-[12px] font-semibold leading-snug line-clamp-2">
                    {book.judul}
                  </p>

                  <span className="inline-block mt-2 text-[9px] bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {book.kategori}
                  </span>

                  <p className="text-[10px] mt-2 text-gray-500">
                    Karya: {book.penulis}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Memuat data buku...</p>
          )}
        </section>
      </main>
    </div>
  );
}
