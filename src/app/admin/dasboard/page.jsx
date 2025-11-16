"use client";

import { useState } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";
import Image from "next/image";

export default function DashboardPage() {
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState({
    title: "",
    description: "",
  });

  // FUNGSI UNTUK MEMBUKA POPUP
  const openModal = (title, desc) => {
    setModalText({ title, description: desc });
    setShowModal(true);
  };

  return (
    <div className="flex bg-white relative">

      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <div className="flex-1 p-8">

        {/* Search bar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative w-96">
            <input
              type="text"
              placeholder="Search"
              className="border px-4 py-2 w-full rounded-md"
            />
            <span className="absolute right-3 top-2.5">🔍</span>
          </div>
        </div>

        {/* Welcome box */}
        <div className="bg-blue-200 p-5 rounded-lg mb-6">
          <h2 className="font-bold text-lg">SELAMAT DATANG, ADMIN!</h2>
          <p className="text-sm mt-1">
            Kelola data perpustakaan dengan mudah dan efisien.
          </p>
        </div>

        {/* Statistik */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          <div className="border p-4 rounded text-center">
            <p className="text-3xl font-bold">78%</p>
            <p className="text-xs font-semibold mt-2">TOTAL PENGGUNA SISWA</p>
          </div>

          <div className="border p-4 rounded text-center">
            <p className="text-3xl font-bold">64%</p>
            <p className="text-xs font-semibold mt-2">TOTAL BUKU</p>
          </div>

          <div className="border p-4 rounded text-center">
            <p className="text-3xl font-bold">44%</p>
            <p className="text-xs font-semibold mt-2">BUKU DIPINJAM</p>
          </div>

          <div className="border p-4 rounded text-center">
            <p className="text-3xl font-bold text-red-500">29%</p>
            <p className="text-xs font-semibold mt-2">BELUM DIKEMBALIKAN</p>
          </div>
        </div>

        {/* Aktivitas */}
        <h3 className="font-semibold mb-4">Aktivitas</h3>

        <div className="space-y-4">

          {/* Contoh Aktivitas 1 */}
          <div className="p-3 border rounded flex items-center gap-4">
            <Image src="/profile1.jpg" alt="profile" width={45} height={45} className="rounded-full" />
            <div>
              <p className="font-medium">Pham Hanni — XI RPL 5</p>
              <p className="text-sm">Aldebaran bagian 1</p>
            </div>

            <button
              onClick={() =>
                openModal("Buku Belum Diambil", "Apakah buku sudah diambil oleh siswa?")
              }
              className="ml-auto text-xs p-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Buku belum diambil
            </button>
          </div>

          {/* Contoh Aktivitas 2 */}
          <div className="p-3 border rounded flex items-center gap-4">
            <Image src="/profile1.jpg" alt="profile" width={45} height={45} className="rounded-full" />
            <div>
              <p className="font-medium">Pham Hanni — XI RPL 5</p>
              <p className="text-sm">Aldebaran bagian 1</p>
            </div>

            <button
              onClick={() =>
                openModal("Belum Dikembalikan", "Apakah buku ini sudah dikembalikan?")
              }
              className="ml-auto text-xs p-2 bg-red-200 text-red-700 rounded hover:bg-red-300"
            >
              Belum dikembalikan
            </button>
          </div>

        </div>
      </div>

      {/* ==============================
                POPUP MODAL
      =============================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-3">📘</div>

            <h2 className="text-lg font-bold">{modalText.title}</h2>
            <p className="text-sm mt-2">{modalText.description}</p>

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded hover:bg-gray-100"
              >
                Cancel
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Iya, sudah
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
