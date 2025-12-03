"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";


export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false, // PENTING!
      });

      console.log("SignIn result:", result);

      if (result?.error) {
        alert("Login gagal: " + result.error);
        setLoading(false);
        return;
      }

      if (result?.ok) {
        // Tunggu sebentar untuk JWT processing
        await new Promise(resolve => setTimeout(resolve, 500));

        const session = await getSession()

        if (session?.user?.role) {
          localStorage.setItem("role", session.user.role);
        }

        // Refresh untuk trigger middleware
        router.refresh();

        const getrole = localStorage.getItem("role")

        if (getrole == "admin"){
          router.push("/admin/dasboard")
        } else if (getrole == "siswa") {
          router.push("/user/home")
        }

      }
    } catch (error) {
      console.error("Login error:", error);
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
            Selamat Datang
          </h2>

          {message.text && (
            <div
              className={`mb-4 p-3 rounded-lg text-sm ${message.type === "success"
                  ? "bg-green-100 text-green-700 border border-green-300"
                  : "bg-red-100 text-red-700 border border-red-300"
                }`}
            >
              {message.text}
            </div>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email..."
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-blue-600"
          />

          <input
            type="password"
            name="password"
            placeholder="Password..."
            value={form.password}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-5 focus:outline-blue-600"
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-2 font-semibold text-white transition ${loading
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
              }`}
          >
            {loading ? "Memproses..." : "Masuk"}
          </button>

          <p className="text-sm text-center mt-4">
            Belum punya akun?{" "}
            <Link href="/user/register" className="text-blue-600 hover:underline">
              Daftar di sini
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
