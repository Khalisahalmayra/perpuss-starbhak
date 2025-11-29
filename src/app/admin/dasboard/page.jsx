"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";
import Image from "next/image";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  const [peminjaman, setPeminjaman] = useState([]);
  const [buku, setBuku] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Protection: jika belum login
  if (status === "loading") {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Memeriksa sesi login...
      </div>
    );
  }

  if (status === "unauthenticated") {
    // Redirect manual
    signIn(); 
    return null;
  }

  // OPTIONAL: Jika hanya admin boleh membuka halaman ini
  // if (session?.user?.role !== "admin") {
  //   return <p className="p-8">Akses ditolak. Halaman ini untuk admin.</p>;
  // }

  // =============================== API FETCH ===============================
  const fetchPeminjaman = async () => {
    try {
      const res = await fetch("/api/admin/peminjaman", { cache: "no-store" });
      const data = await res.json();
      setPeminjaman(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
      setPeminjaman([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBuku = async () => {
    try {
      const res = await fetch("/api/buku", { cache: "no-store" });
      const data = await res.json();
      setBuku(Array.isArray(data) ? data : data.data || []);
    } catch (error) {
      console.error("Gagal mengambil data buku:", error);
      setBuku([]);
    }
  };

  useEffect(() => {
    fetchPeminjaman();
    fetchBuku();
  }, []);

  // =============================== MODAL HANDLER ===============================
  const openModal = (item, action) => {
    setModalData({ ...item, action });
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!modalData) return;

    const newStatus =
      modalData.action === "ambil"
        ? "dipinjam"
        : modalData.action === "kembali"
        ? "dikembalikan"
        : modalData.action === "tolak"
        ? "ditolak"
        : "";

    try {
      const res = await fetch(`/api/admin/peminjaman/${modalData.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const output = await res.json();

      if (!res.ok) {
        alert("Gagal mengupdate status!\n" + (output.message || ""));
        return;
      }

      setShowModal(false);
      fetchPeminjaman();
    } catch (error) {
      console.error(error);
      alert("Gagal mengupdate status!");
    }
  };

  const totalDipinjam = peminjaman.filter((p) => p.status === "dipinjam").length;
  const totalBelumDikembalikan = totalDipinjam;
  const totalSudahDikembalikan = peminjaman.filter(
    (p) => p.status === "dikembalikan"
  ).length;

  const totalBukuTersedia = buku.reduce(
    (sum, item) => sum + Number(item.stok || 0),
    0
  );

  // =============================== UI START ===============================
  return (
    <div className="flex bg-white relative">
      <AdminSidebar />

      <div className="flex-1 p-8">
        <div className="bg-blue-200 p-5 rounded-lg mb-6">
          <h2 className="font-bold text-lg">
            SELAMAT DATANG, {session?.user?.nama || "ADMIN"}!
          </h2>
          <p className="text-sm mt-1">
            Kelola data perpustakaan dengan mudah dan efisien.
          </p>
        </div>

        {/* STATISTIK */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 border rounded-lg bg-yellow-100">
            <p className="text-xs text-gray-600">Total Buku Dipinjam</p>
            <h3 className="font-bold text-xl">{totalDipinjam}</h3>
          </div>

          <div className="p-4 border rounded-lg bg-green-100">
            <p className="text-xs text-gray-600">Total Buku Tersedia</p>
            <h3 className="font-bold text-xl">{totalBukuTersedia}</h3>
          </div>

          <div className="p-4 border rounded-lg bg-red-100">
            <p className="text-xs text-gray-600">Belum Dikembalikan</p>
            <h3 className="font-bold text-xl">{totalBelumDikembalikan}</h3>
          </div>

          <div className="p-4 border rounded-lg bg-blue-100">
            <p className="text-xs text-gray-600">Sudah Dikembalikan</p>
            <h3 className="font-bold text-xl">{totalSudahDikembalikan}</h3>
          </div>
        </div>

        {/* LIST PEMINJAMAN */}
        <h3 className="font-semibold mb-4">Aktivitas</h3>

        {loading ? (
          <p className="text-sm text-gray-500 text-center">Memuat data...</p>
        ) : (
          <div className="space-y-4">
            {peminjaman.map((item, index) => (
              <div
                key={item.id}
                className="p-4 border rounded flex items-center gap-4"
              >
                <div className="flex items-center justify-center w-8 h-8 bg-gray-200 rounded-full font-bold text-sm">
                  {index + 1}
                </div>

                <Image
                  src={item.buku_img || "/no-book.jpg"}
                  alt="foto buku"
                  width={50}
                  height={50}
                  className="object-cover rounded"
                />

                <div className="flex-1">
                  <p className="text-sm font-semibold">
                    {item.buku_judul || "Judul tidak tersedia"}
                  </p>

                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-600">
                    <span>
                      <strong>Nama:</strong> {item.user_nama || "-"}
                    </span>
                    <span>•</span>
                    <span>
                      <strong>Kelas:</strong> {item.user_kelas || "-"}
                    </span>
                  </div>

                  <p className="text-xs mt-1">
                    Status:{" "}
                    <span
                      className={`font-semibold ${
                        item.status === "pending"
                          ? "text-yellow-600"
                          : item.status === "dipinjam"
                          ? "text-blue-600"
                          : item.status === "dikembalikan"
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {item.status?.toUpperCase()}
                    </span>
                  </p>
                </div>

                {item.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(item, "ambil")}
                      className="text-xs px-3 py-2 bg-blue-200 rounded hover:bg-blue-300 whitespace-nowrap"
                    >
                      Konfirmasi Ambil
                    </button>

                    <button
                      onClick={() => openModal(item, "tolak")}
                      className="text-xs px-3 py-2 bg-red-200 text-red-700 rounded hover:bg-red-300"
                    >
                      Tolak
                    </button>
                  </div>
                )}

                {item.status === "dipinjam" && (
                  <button
                    onClick={() => openModal(item, "kembali")}
                    className="text-xs px-3 py-2 bg-green-200 text-green-700 rounded hover:bg-green-300 whitespace-nowrap"
                  >
                    Tandai Sudah Dikembalikan
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && modalData && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white w-[400px] p-6 rounded-xl shadow-lg text-center">
            <div className="text-4xl mb-3">📘</div>

            <h2 className="text-lg font-bold">
              {modalData.action === "ambil"
                ? "Konfirmasi Peminjaman?"
                : modalData.action === "kembali"
                ? "Konfirmasi Pengembalian?"
                : "Tolak Peminjaman?"}
            </h2>

            <p className="text-sm mt-2">
              Buku: <b>{modalData.buku_judul}</b>
            </p>

            <p className="text-sm">
              Atas nama: <b>{modalData.user_nama || "Tidak diketahui"}</b>
            </p>

            {modalData.user_kelas && (
              <p className="text-sm text-gray-600">
                Kelas: <b>{modalData.user_kelas}</b>
              </p>
            )}

            {modalData.action === "tolak" && (
              <p className="text-xs text-red-600 mt-2">
                Setelah ditolak, peminjaman tidak bisa dikembalikan.
              </p>
            )}

            <div className="flex gap-4 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 border py-2 rounded hover:bg-gray-100"
              >
                Batal
              </button>

              <button
                onClick={handleConfirm}
                className={`flex-1 py-2 rounded text-white ${
                  modalData.action === "tolak"
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                Iya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
