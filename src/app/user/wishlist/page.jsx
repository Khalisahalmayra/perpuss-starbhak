"use client";

import Sidebar from "../sidebar";
import Image from "next/image";
import { IoSearch } from "react-icons/io5";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function WishlistPage() {
  const [wishlistBooks, setWishlistBooks] = useState([]);

  // 🔥 Ambil data dari LocalStorage saat halaman dibuka
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setWishlistBooks(saved);
  }, []);

  // 🔥 Unwishlist (hapus dari wishlist)
  const handleUnwishlist = (id) => {
    const updated = wishlistBooks.filter((item) => item.id !== id);
    setWishlistBooks(updated);
    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />

      <main className="flex-1 p-6">
        {/* Search Bar */}
        <div className="flex items-center w-full max-w-lg border border-gray-300 rounded-lg px-3 py-2 mb-6">
          <input
            type="text"
            placeholder="Search"
            className="flex-1 outline-none text-sm"
          />
          <IoSearch className="text-lg" />
        </div>

        {/* Wishlist Books Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {wishlistBooks.length > 0 ? (
            wishlistBooks.map((book, index) => (
              <div
                key={index}
                className="relative bg-white rounded-xl shadow hover:shadow-md transition p-3"
              >
                {/* ❤️ Unwishlist Button */}
                <button
                  onClick={() => handleUnwishlist(book.id)}
                  className="absolute top-2 left-2 bg-white p-1 rounded-lg shadow"
                >
                  ❤️
                </button>

                {/* Klik Card → Detail */}
                <Link href={`/user/detail/${book.id}`}>
                  <Image
                    src={book.img}
                    width={150}
                    height={230}
                    alt={book.title || "Book Image"}
                    className="rounded-lg w-full object-cover cursor-pointer"
                  />

                  <p className="mt-2 text-[11px] font-semibold leading-snug line-clamp-2">
                    {book.title}
                  </p>

                  <span className="inline-block mt-2 text-[9px] bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {book.category}
                  </span>

                  <p className="text-[9px] mt-2 text-gray-500">
                    Karya: {book.author}
                  </p>
                </Link>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-sm">Wishlist kosong...</p>
          )}
        </div>
      </main>
    </div>
  );
}
