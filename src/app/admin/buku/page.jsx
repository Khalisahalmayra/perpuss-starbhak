"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "@/app/components/AdminSidebar";
import Image from "next/image";

export default function BukuPage() {
  const [bukuList, setBukuList] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({
    id: null,
    img: "",
    judul: "",
    penulis: "",
    penerbit: "",
    tahun_terbit: "",
    stok: "",
    kategori: ""
  });

  // Fungsi Notifikasi
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Get All Buku
  const getBuku = async () => {
    const res = await fetch("/api/buku");
    const data = await res.json();
    setBukuList(data);
  };

  useEffect(() => {
    getBuku();
  }, []);

  // Input Handler
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit (Tambah / Edit)
  const handleSubmit = async () => {
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch("/api/buku", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...formData,
        tahun_terbit: Number(formData.tahun_terbit),
        stok: Number(formData.stok),
      })
    });

    const result = await res.json();

    if (!res.ok) return showToast(result.message, "error");

    showToast(result.message, "success");

    setShowForm(false);
    getBuku();
  };

  // ⭐ Delete Buku (Tanpa alert / confirm)
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/buku/${id}`, { method: "DELETE" });
      const result = await res.json();

      if (!res.ok) return showToast(result.message, "error");

      showToast(result.message, "success");
      getBuku();

    } catch (error) {
      showToast("Gagal menghapus buku", "error");
    }
  };

  return (
    <div className="flex bg-white">

      <AdminSidebar />

      <div className="flex-1 p-8">
        <h2 className="text-xl font-bold mb-4">Daftar Buku</h2>

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-4 right-4 px-4 py-2 rounded shadow-lg text-white 
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
          >
            {toast.message}
          </div>
        )}

        <button
          className="mb-4 border px-3 py-2 rounded hover:bg-gray-100"
          onClick={() => {
            setIsEdit(false);
            setShowForm(true);
            setFormData({
              id: null,
              img: "",
              judul: "",
              penulis: "",
              penerbit: "",
              tahun_terbit: "",
              stok: "",
              kategori: ""
            });
          }}
        >
          + Tambah Buku Baru
        </button>

        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">NO</th>
                <th className="p-3">BUKU</th>
                <th className="p-3">KATEGORI</th>
                <th className="p-3">STOK</th>
                <th className="p-3">AKSI</th>
              </tr>
            </thead>

            <tbody>
              {bukuList.map((item, index) => (
                <tr key={item.id} className="border-t">
                  <td className="p-3">{index + 1}</td>

                  <td className="p-3 flex items-center gap-3">
                    <Image
                      src={item.img || "/no-image.png"}
                      width={45}
                      height={60}
                      alt="buku"
                      className="rounded"
                      unoptimized
                    />
                    <div>
                      <p className="font-semibold">{item.judul}</p>
                      <p className="text-xs">{item.penulis}</p>
                    </div>
                  </td>

                  <td className="p-3">{item.kategori}</td>
                  <td className="p-3">{item.stok}</td>

                  <td className="p-3 flex gap-4 text-lg">
                    <button onClick={() => handleEdit(item)}>✏️</button>
                    <button onClick={() => handleDelete(item.id)}>🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FORM Pop-up */}
        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white w-[450px] p-6 rounded-xl shadow-lg">
              <h2 className="text-lg font-bold mb-4">
                {isEdit ? "Edit Buku" : "Tambah Buku"}
              </h2>

              <div className="space-y-3 text-sm">
                <input name="img" placeholder="Link Gambar"
                  value={formData.img} onChange={handleChange}
                  className="border px-3 py-2 w-full rounded" />

                <input name="judul" placeholder="Judul"
                  value={formData.judul} onChange={handleChange}
                  className="border px-3 py-2 w-full rounded" />

                <input name="penulis" placeholder="Penulis"
                  value={formData.penulis} onChange={handleChange}
                  className="border px-3 py-2 w-full rounded" />

                <input name="penerbit" placeholder="Penerbit"
                  value={formData.penerbit} onChange={handleChange}
                  className="border px-3 py-2 w-full rounded" />

                <input name="tahun_terbit" type="number" placeholder="Tahun Terbit"
                  value={formData.tahun_terbit} onChange={handleChange}
                  className="border px-3 py-2 w-full rounded" />

                <input name="stok" type="number" placeholder="Stok"
                  value={formData.stok} onChange={handleChange}
                  className="border px-3 py-2 w-full rounded" />

                <input name="kategori" placeholder="Kategori"
                  value={formData.kategori} onChange={handleChange}
                  className="border px-3 py-2 w-full rounded" />
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 border py-2 rounded hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  Simpan
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
