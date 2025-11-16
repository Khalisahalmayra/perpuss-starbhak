import connection from "../../../../lib/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id, buku_id, tanggal_pinjam, tanggal_kembali, lama_pinjam } = await req.json();

    const [result] = await connection.execute(
      `INSERT INTO peminjaman (user_id, buku_id, tanggal_pinjam, tanggal_kembali, lama_pinjam)
       VALUES (?, ?, ?, ?, ?)`,
      [user_id, buku_id, tanggal_pinjam, tanggal_kembali, lama_pinjam]
    );

    return NextResponse.json({ 
      message: "Peminjaman berhasil disimpan",
      id: result.insertId
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Gagal menyimpan peminjaman", error: error.message },
      { status: 500 }
    );
  }
}
