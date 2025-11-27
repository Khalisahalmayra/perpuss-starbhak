import pool from "@/lib/database";
import { NextResponse } from "next/server";

// GET - Ambil semua data peminjaman
export async function GET() {
  try {
    const connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      `SELECT 
        peminjaman.id,
        peminjaman.user_id,
        peminjaman.buku_id,
        peminjaman.tanggal_pinjam,
        peminjaman.tanggal_kembali,
        peminjaman.lama_pinjam,
        peminjaman.status,
        users.nama AS user_nama,
        users.kelas AS user_kelas,
        users.email AS user_email,
        buku.judul AS buku_judul,
        buku.img AS buku_img,
        buku.penulis AS buku_penulis
       FROM peminjaman
       JOIN users ON peminjaman.user_id = users.id
       JOIN buku ON peminjaman.buku_id = buku.id
       ORDER BY peminjaman.id DESC`
    );
    
    connection.release();

    return new NextResponse(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error("Database Error:", error);
    
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        message: "Terjadi kesalahan saat mengambil data", 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}

// POST - Tambah peminjaman baru
export async function POST(request) {
  try {
    const body = await request.json();
    const { user_id, buku_id, tanggal_pinjam, lama_pinjam } = body;

    console.log("📝 Data peminjaman:", { user_id, buku_id, tanggal_pinjam, lama_pinjam });

    // Validasi input
    if (!user_id || !buku_id || !tanggal_pinjam || !lama_pinjam) {
      return new NextResponse(
        JSON.stringify({ 
          success: false,
          message: "Data tidak lengkap" 
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // Hitung tanggal kembali
    const tanggalPinjam = new Date(tanggal_pinjam);
    const tanggalKembali = new Date(tanggalPinjam);
    tanggalKembali.setDate(tanggalPinjam.getDate() + parseInt(lama_pinjam));
    const tanggal_kembali = tanggalKembali.toISOString().split('T')[0];

    const connection = await pool.getConnection();

    // Insert data peminjaman
    const [result] = await connection.execute(
      `INSERT INTO peminjaman 
       (user_id, buku_id, tanggal_pinjam, tanggal_kembali, lama_pinjam, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [user_id, buku_id, tanggal_pinjam, tanggal_kembali, lama_pinjam]
    );

    connection.release();

    console.log("✅ Peminjaman berhasil dengan ID:", result.insertId);

    return new NextResponse(
      JSON.stringify({ 
        success: true,
        message: "Peminjaman berhasil diajukan",
        id: result.insertId
      }),
      {
        status: 201,
        headers: { 'Content-Type': 'application/json' },
      }
    );

  } catch (error) {
    console.error("Database Error:", error);
    
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        message: "Gagal mengajukan peminjaman", 
        error: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}