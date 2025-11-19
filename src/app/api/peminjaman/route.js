import pool from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await pool.execute(
      `SELECT 
        peminjaman.id,
        peminjaman.tanggal_pinjam,
        peminjaman.tanggal_kembali,
        peminjaman.lama_pinjam,
        peminjaman.status,
        users.nama AS nama_user,
        buku.judul AS judul_buku
       FROM peminjaman
       JOIN users ON peminjaman.user_id = users.id
       JOIN buku ON peminjaman.buku_id = buku.id
       ORDER BY peminjaman.id DESC`
    );

    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}
