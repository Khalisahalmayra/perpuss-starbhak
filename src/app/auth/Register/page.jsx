"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";

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

      setMessage({
        text: "Registrasi berhasil! Melakukan login...",
        type: "success",
      });

      // === 2. AUTO LOGIN MENGGUNAKAN NEXTAUTH ===
      const loginResult = await signIn("credentials", {
        redirect: false,
        email: form.email,
        password: form.password,
      });

      if (loginResult?.error) {
        setMessage({
          text: "Akun berhasil dibuat tetapi gagal login otomatis.",
          type: "error",
        });
        return;
      }

      // === 3. REDIRECT KE DASHBOARD ===
      setTimeout(() => {
        router.push("/user/home");
      }, 800);
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
        </form>
      </div>
    </div>
  );
}
