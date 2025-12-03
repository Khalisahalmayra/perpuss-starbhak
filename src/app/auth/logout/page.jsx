"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";

export default function LogoutPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);

  const user = session?.user;

  const handleLogout = async () => {
    setLoading(true);

    try {
      // NextAuth signOut
      await signOut({
        redirect: false, // Jangan auto-redirect
        callbackUrl: "/login", // Optional: URL setelah logout
      });
      localStorage.clear()
      console.log("✅ Logout berhasil");

      // Manual redirect
      router.push("/auth/Login");
      router.refresh(); // Refresh untuk clear cache
    } catch (error) {
      console.error("Error logout:", error);
      alert("Terjadi kesalahan saat logout");
    } finally {
      setLoading(false);
    }
  };

  const cancelLogout = () => {
    if (user?.role === "admin") {
      router.push("/admin/dasboard");
    } else {
      router.push("/user/home");
    }
  };

  return (
    <div className="min-h-screen w-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-10 text-center w-[550px]">

        <div className="flex justify-center mb-5">
          <div className="w-[90px] h-[90px] rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user?.image ? (
              <Image 
                src={user.image} 
                alt="user" 
                width={90} 
                height={90}
                className="object-cover"
              />
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-12 h-12 text-gray-500"
              >
                <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
              </svg>
            )}
          </div>
        </div>

        {user && (
          <p className="text-sm text-gray-600 mb-2">
            {user.name || user.nama || user.email}
          </p>
        )}

        <h2 className="text-[18px] font-semibold mb-6">
          Kamu yakin ingin keluar dari akun sekarang?
        </h2>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handleLogout}
            disabled={loading}
            className={`px-6 py-2 rounded-md transition font-medium ${
              loading 
                ? "bg-gray-300 text-gray-500 cursor-not-allowed" 
                : "border border-gray-700 hover:bg-gray-200"
            }`}
          >
            {loading ? "Memproses..." : "Iya, keluar sekarang"}
          </button>

          <button
            onClick={cancelLogout}
            disabled={loading}
            className="px-10 py-2 border border-gray-400 rounded-md hover:bg-gray-200 transition font-medium"
          >
            Tidak
          </button>
        </div>

      </div>
    </div>
  );
}