"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Register() {
  const router = useRouter();

  const [form, setForm] = useState({
    nama: "",
    kelas: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // === 1. SIMPAN DATA KE DATABASE ===
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setLoading(false);
        return setMessage({
          text: data.message || "Gagal register",
          type: "error",
        });
      }

      // === 2. TIDAK ADA AUTO LOGIN ===
      setMessage({
        text: "Registrasi berhasil! Silakan login untuk masuk.",
        type: "success",
      });

      // === 3. REDIRECT OTOMATIS KE LOGIN ===
      setTimeout(() => {
        router.push("/auth/Login");
      }, 1200);

    } catch (err) {
      console.error("Error register:", err);
      setMessage({
        text: "Terjadi kesalahan server",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      <div className="md:w-4/12 w-full flex items-center justify-center bg-gray-50 p-8">
        <Image
          src="/Group 29.png"
          alt="Illustration"
          width={450}
          height={450}
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="md:w-7/12 w-full flex items-center justify-center px-8 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <h2 className="text-xl md:text-2xl font-bold mb-6 text-center">
            Buat Akun Anda
          </h2>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${
                message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <input
            type="text"
            name="nama"
            placeholder="Nama lengkap"
            value={form.nama}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
          />

          <input
            type="text"
            name="kelas"
            placeholder="Kelas (opsional)"
            value={form.kelas}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2 font-semibold text-white transition ${
              loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Memproses..." : "Daftar Sekarang"}
          </button>

          {/* === Tambahan tulisan login di sini === */}
          <p className="text-center mt-4 text-sm text-gray-600">
            Sudah punya akun?{" "}
            <span
              onClick={() => router.push("/auth/Login")}
              className="text-blue-600 font-semibold cursor-pointer hover:underline"
            >
              Masuk di sini
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}
