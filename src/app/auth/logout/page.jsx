"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = () => {
    // Hapus session/token di sini nanti
    router.push("/"); // pindah ke landing page
  };

  const cancelLogout = () => {
    router.back(); // kembali ke halaman sebelumnya
  };

  return (
    <div className="min-h-screen w-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-white rounded-xl shadow-xl p-10 text-center w-[550px]">

        <div className="flex justify-center mb-5">
          <Image src="/user-icon.png" alt="user" width={90} height={90} />
        </div>

        <h2 className="text-[18px] font-semibold mb-6">
          Kamu yakin ingin keluar dari akun sekarang?
        </h2>

        <div className="flex items-center justify-center gap-4 mt-4">
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-gray-700 rounded-md hover:bg-gray-200 transition"
          >
            Iya, keluar sekarang
          </button>

          <button
            onClick={cancelLogout}
            className="px-10 py-2 border border-gray-400 rounded-md hover:bg-gray-200 transition"
          >
            Tidak
          </button>
        </div>

      </div>
    </div>
  );
}
