"use client";

import Link from "next/link";
import Image from "next/image";
import { useRef } from "react";

export default function Home() {
  const scrollRef = useRef(null);

  // Fungsi untuk scroll kiri dan kanan
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -300 : 300,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-4 shadow-sm bg-white">
        <div className="flex items-center space-x-3">
          <Image
            src="/logo.png"
            alt="Logo Pusat Literasi"
            width={40}
            height={40}
          />
          <h1 className="font-bold text-sm md:text-base">
            PUSAT LITERASI STARBHAK
          </h1>
        </div>

        <nav className="flex space-x-6 text-sm md:text-base font-medium">
          <a href="#" className="hover:text-blue-600 transition-colors">
            HOME
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            TENTANG
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            KOTAK SARAN
          </a>
          <a href="#" className="hover:text-blue-600 transition-colors">
            KONTAK
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center">
        <Image
          src="/sekolah.jpg"
          alt="Background Sekolah"
          fill
          className="object-cover brightness-50"
          priority
        />

        <div className="relative z-10 max-w-2xl text-white px-4">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-4">
            SELAMAT DATANG <br /> DI PUSAT LITERASI STARBHAK.
          </h2>
          <p className="text-sm md:text-base mb-3">
            Temukan ribuan buku, referensi, dan sumber pelajaran terbaik <br />
            untuk menunjang proses belajar anda!
          </p>
          <p className="text-sm md:text-base mb-6">
            Belajar lebih mudah, cepat, dan menyenangkan <br />
            bersama Pusat Literasi Starbhak
          </p>

        <div className="flex justify-center space-x-4">
          <Link href="/auth/Register">
            <button className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-5 py-2 rounded-lg shadow">
            DAFTAR SEKARANG
            </button>
              </Link>

                <Link href="/auth/Login">
              <button className="bg-white hover:bg-gray-200 text-black font-semibold px-5 py-2 rounded-lg shadow">
                MASUK
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Rekomendasi Buku Unggulan */}
      <section className="bg-white py-14 px-8">
        {/* Judul Section */}
        <div className="mb-6">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
            <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            Rekomendasi Buku Unggulan
          </h2>
          <p className="text-gray-600 text-sm ml-5 mt-1">
            Temukan inspirasi baca kamu!
          </p>
        </div>

        {/* Carousel Buku */}
        <div className="relative">
          {/* Tombol Panah Kiri */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
          >
            ‹
          </button>
          {/* List Buku */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto space-x-6 scrollbar-hide scroll-smooth px-8"
          >
            {[
              {
                img: "/buku.jpg",
                title: "Seorang Wanita yang Ingin Hidup Penuh Makna",
                category: "Self Improvement",
                author: "Arleen Kuriananda",
              },
              {
                img: "/buku2.jpg",
                title: "Filosofi Teras",
                category: "Pengembangan Diri",
                author: "Henry Manampiring",
              },
              {
                img: "/buku3.jpg",
                title: "Laskar Pelangi",
                category: "Novel",
                author: "Andrea Hirata",
              },
              {
                img: "/buku4.jpeg",
                title: "Think and Grow Rich",
                category: "Motivasi",
                author: "Napoleon Hill",
              },
              {
                img: "/buku5.png",
                title: "Bumi Manusia",
                category: "Sastra",
                author: "Pramoedya Ananta Toer",
              },
            ].map((book, index) => (
              <div
                key={index}
                className="min-w-[220px] bg-white rounded-xl shadow hover:shadow-md transition-shadow"
              >
                <Image
                  src={book.img}
                  alt={book.title}
                  width={220}
                  height={320}
                  className="rounded-t-xl object-cover"
                />
                <div className="p-3">
                  <p className="text-sm font-semibold leading-snug">{book.title}</p>
                  <span className="inline-block mt-2 text-xs font-medium bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    {book.category}
                  </span>
                  <p className="text-xs mt-2 text-gray-500">Karya: {book.author}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Tombol Panah Kanan */}
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-gray-200 hover:bg-gray-300 p-2 rounded-full shadow"
          >
            ›
          </button>
        </div>
      </section>

              {/* Section Tentang Pusat Literasi Starbhak */}
      <section className="bg-[#c7d8f4] rounded-xl mx-8 my-12 p-6 md:p-10 flex flex-col md:flex-row items-center justify-between">
        {/* Teks */}
        <div className="text-gray-800 md:w-2/3">
          <p className="text-sm md:text-base leading-relaxed">
            <strong>Pusat Literasi Starbhak</strong> hadir sebagai wadah untuk menumbuhkan
            semangat membaca, menulis, dan berpikir kritis di lingkungan
            <strong> SMK Taruna Bhakti</strong>. Melalui platform digital ini, kami berkomitmen
            menyediakan akses ilmu pengetahuan tanpa batas bagi seluruh warga
            sekolah kapan pun dan di mana pun.
          </p>
        </div>

        {/* Gambar */}
        <div className="mt-6 md:mt-0 md:w-1/3 flex justify-center">
          <Image
            src="/image 4.png" // ganti dengan nama file gambar kamu, misal: /literasi.png
            alt="Ilustrasi Membaca"
            width={180}
            height={180}
            className="object-contain"
          />
        </div>
      </section>

              {/* Section Berita Terbaru */}
      <section className="bg-white py-14 px-8">
        <div className="mb-8 text-center md:text-left">
          <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2 justify-center md:justify-start">
            <span className="w-3 h-3 bg-gray-400 rounded-full"></span>
            Berita Terbaru
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {/* Kartu Berita */}
          <a 
            href="https://berita.depok.go.id/wakil-wali-kota-depok-serahkan-e-ktp-ke-pelajar-smk-taruna-bhakti" 
            className="block bg-gray-50 rounded-xl shadow hover:shadow-md transition overflow-hidden"
          >
            <Image
              src="/berita1.png"      
              alt="Wakil Wali Kota Depok Serahkan e-KTP ke Pelajar SMK Taruna Bhakti"
              width={400}
              height={250}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <h3 className="text-sm md:text-base font-semibold mb-2">
                Wakil Wali Kota Depok Serahkan e-KTP ke Pelajar SMK Taruna Bhakti …
              </h3>
              <p className="text-xs text-gray-500">
                Rabu, 1 Oktober 2025
              </p>
            </div>
          </a>

          <a 
            href="https://www.kompasiana.com/mpkosisstarbhak7899/68481017ed64156c2625b363/idul-adha-1446-smk-taruna-bhakti" 
            className="block bg-gray-50 rounded-xl shadow hover:shadow-md transition overflow-hidden"
          >
            <Image
              src="/berita2.png"
              alt="Pesan Wakil Wali Kota Depok Rekam e-KTP"
              width={400}
              height={250}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <h3 className="text-sm md:text-base font-semibold mb-2">
                Momen Idul Adha Bersama SMK Taruna Bhakti
              </h3>
              <p className="text-xs text.gray-500">
                Kamis, 2 Oktober 2025
              </p>
            </div>
          </a>

          <a 
            href="https://www.kompasiana.com/zerocut2356/684c8267ed641538481ea9c4/mahasiswa-ubsi-tingkatkan-literasi-digital-siswa-smk-taruna-bhakti-depok" 
            className="block bg-gray-50 rounded-xl shadow hover:shadow-md transition overflow-hidden"
          >
            <Image
              src="/berita3.png"
              alt="Disdukcapil Depok Lakukan Perekaman e-KTP di SMK Taruna Bhakti"
              width={400}
              height={250}
              className="object-cover w-full h-48"
            />
            <div className="p-4">
              <h3 className="text-sm md:text-base font-semibold mb-2">
                Mahasiswa UBSI Tingkatkan Literasi Digital Siswa SMK Taruna Bhakti
              </h3>
              <p className="text-xs text-gray-500">
                Rabu, 1 Oktober 2025
              </p>
            </div>
          </a>
        </div>
      </section>
        
        {/* Section CTA Pusat Literasi */}
<section className="bg-[#90A4CE] rounded-xl px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-6 my-12">
  <div className="text-white max-w-lg">
    <p className="text-base md:text-lg font-medium">
      Mari mulai perjalanan literasi kamu dengan membaca dan meminjam buku di{" "}
      <span className="font-semibold">Pusat Literasi Starbhak</span>
    </p>

    <div className="mt-5 flex gap-4">
      <a
        href="/daftar"
        className="bg-[#003D9A] text-white font-semibold text-sm md:text-base py-2 px-5 rounded-lg shadow hover:bg-[#002e7a] transition"
      >
        DAFTAR SEKARANG
      </a>
      <a
        href="/login"
        className="bg-white text-black font-semibold text-sm md:text-base py-2 px-5 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
      >
        MASUK
      </a>
    </div>
  </div>

  <div className="flex-shrink-0">
    <img
      src="/image 5.png"  // ganti dengan file ilustrasi kamu (misalnya yang kamu kirim)
      alt="Ilustrasi siswa Starbhak"
      className="w-36 md:w-44 h-auto"
    />
  </div>
</section>
            {/* Footer */}
<footer className="bg-white border-t mt-14 px-8 py-10">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

    {/* Kolom 1 */}
    <div>
      <div className="flex items-center gap-3 mb-3">
        <Image src="/logo.png" alt="Logo Starbhak" width={45} height={45} />
        <h2 className="font-bold text-sm md:text-base">
          PUSAT LITERASI STARBHAK
        </h2>
      </div>

      <p className="text-sm text-gray-600 leading-relaxed max-w-sm">
        Pusat Literasi Starbhak adalah platform digital yang mendukung budaya
        baca, belajar, dan berbagi pengetahuan di SMK Taruna Bhakti.
      </p>

      {/* Sosial Media */}
      <div className="flex gap-3 mt-4 text-xl text-gray-700">
        <a href="#"><i className="ri-instagram-line"></i></a>
        <a href="#"><i className="ri-facebook-circle-fill"></i></a>
        <a href="#"><i className="ri-youtube-fill"></i></a>
        <a href="#"><i className="ri-whatsapp-fill"></i></a>
      </div>
    </div>

    {/* Kolom 2 */}
    <div>
      <h3 className="font-bold mb-3 text-gray-800">TENTANG KAMI</h3>
      <ul className="text-sm text-gray-600 space-y-2">
        <li><a href="#" className="hover:text-blue-600">Tentang Pusat Literasi Starbhak</a></li>
        <li><a href="#" className="hover:text-blue-600">VISI & MISI</a></li>
        <li><a href="#" className="hover:text-blue-600">Program Literasi</a></li>
        <li><a href="#" className="hover:text-blue-600">Dokumentasi Kegiatan</a></li>
      </ul>
    </div>

    {/* Kolom 3 */}
    <div>
      <h3 className="font-bold mb-3 text-gray-800">KONTAK KAMI</h3>
      <p className="text-sm text-gray-600 leading-relaxed">
        Jln. Pekapuran Kel. Curug ,<br/>
        Kec. Cimanggis Depok Kode Pos: 16953.<br/>
        Telp. (021) 8744810.<br/>
        Email: taruna@smktarunabhakti.
      </p>
    </div>
  </div>

  {/* Garis pembatas */}
  <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
    <p className="text-sm text-gray-600 text-center md:text-left">
      Segera Daftarkan Email anda untuk mendapatkan update buku yang akan ada di Pusat Literasi Starbhak
    </p>

    {/* Input email */}
    <div className="flex items-center gap-3">
      <input
        type="email"
        placeholder="Masukkan Email Anda"
        className="border rounded-lg px-4 py-2 text-sm w-64"
      />
      <button className="bg-[#003D9A] hover:bg-[#002f76] text-white px-4 py-2 rounded-lg text-sm">
        Kirim
      </button>
    </div>
  </div>
</footer>
    </div>
  );
}
