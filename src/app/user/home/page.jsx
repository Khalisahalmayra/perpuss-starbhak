"use client";

import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
import Sidebar from "../sidebar";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [bukuList, setBukuList] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);

  // Deteksi client untuk mencegah hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Ambil data user dari API session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/user", { credentials: "include" });

        if (res.ok) {
          const data = await res.json();

          setUser({
            nama: data.user?.nama || "Pengguna",
            kelas: data.user?.kelas || "Tidak ada",
            email: data.user?.email || "",
            role: data.user?.role || "",
          });
        }
      } catch (error) {
        console.error("Error fetch user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  // Ambil buku terbaru
  useEffect(() => {
    const fetchBuku = async () => {
      try {
        const res = await fetch("/api/buku?limit=5");
        const data = await res.json();
        setBukuList(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching buku:", error);
        setBukuList([]);
      }
    };

    fetchBuku();
  }, []);

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar user={user} loading={loading} />

      <main className="flex-1 p-6 flex flex-col gap-6">
        
        {/* Search */}
        <div className="flex items-center w-full max-w-md border border-gray-300 rounded-lg px-3 py-2">
          <input 
            type="text" 
            placeholder="Search"
            className="flex-1 outline-none text-sm" 
          />
          <IoSearch className="text-lg" />
        </div>

        {/* WELCOME SECTION */}
        <div className="bg-[#5D80B6] text-white rounded-lg p-6 max-w-4xl">
          <h2 className="font-bold text-sm md:text-base">
            SELAMAT DATANG,{" "}
            {isClient 
              ? (loading 
                  ? "LOADING..." 
                  : user?.nama?.toUpperCase() || "PENGGUNA")
              : ""}
            !
          </h2>

          <p className="mt-2 text-sm leading-relaxed">
            Kamu punya beberapa buku menarik untuk dijelajahi hari ini.<br />
            Yuk mulai menambah wawasanmu di Perpustakaan Starbhak.
          </p>

          <Link href="/user/kategori">
            <button className="mt-4 bg-white text-black px-4 py-2 rounded-lg font-medium hover:bg-gray-200 transition">
              Lihat koleksi buku
            </button>
          </Link>
        </div>

        {/* Buku terbaru */}
        <section className="bg-white pt-4">
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold flex items-center gap-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
              Buku Terbaru
            </h2>
          </div>

          {bukuList.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {bukuList.map((book) => (
                <Link
                  key={book.id}
                  href={`/user/detail/${book.id}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 cursor-pointer block"
                >
                  <Image
                    src={book.img}
                    alt={book.judul}
                    width={180}
                    height={250}
                    className="rounded-lg w-full object-cover"
                    unoptimized
                  />
                  <p className="mt-2 text-[11px] font-semibold leading-snug line-clamp-2">
                    {book.judul}
                  </p>
                  <span className="inline-block mt-2 text-[9px] bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {book.kategori}
                  </span>
                  <p className="text-[9px] mt-2 text-gray-500">
                    Karya: {book.penulis}
                  </p>
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">Memuat data buku...</p>
          )}
        </section>

        {/* Coming Soon */}
        <div className="bg-[#5D80B6] rounded-lg p-6 flex items-center justify-between text-white">
          <div>
            <p className="font-bold text-sm md:text-base tracking-wide uppercase">
              Akan Segera Datang di Pusat Literasi Starbhak !
            </p>
            <p className="mt-2 text-xs md:text-sm">
              Untukmu, Anak Bungsu — karya Hidya Hanin
            </p>
          </div>

          <Image
            src="/untukmu.jpg"
            alt="Buku Coming Soon"
            width={90}
            height={140}
            className="rounded shadow-md object-cover"
          />
        </div>
      </main>
    </div>
  );
}
