"use client";

import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-[480px] p-10 rounded-xl shadow-lg">

        <div className="flex justify-center mb-6">
          <div className="w-32 h-32 rounded-full border-2 border-gray-300 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-20 h-20 text-gray-700"
            >
              <path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" />
            </svg>
          </div>
        </div>

        <p className="text-center text-xl font-semibold mb-6">
          kamu yakin ingin keluar akun sekarang?
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={handleLogout}
            className="px-5 py-2 border border-gray-400 rounded-md hover:bg-gray-100 transition"
          >
            iya, keluar sekarang
          </button>

          <button
            onClick={() => router.push("/admin/dasboard")}
            className="px-10 py-2 border border-gray-400 rounded-md hover:bg-gray-100 transition"
          >
            tidak
          </button>
        </div>
      </div>
    </div>
  );
}
