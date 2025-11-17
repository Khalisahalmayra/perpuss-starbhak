import connection from "../../lib/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { user_id, buku_id, tanggal_pinjam, lama_pinjam } = await req.json();

    const pinjamDate = new Date(tanggal_pinjam);
    pinjamDate.setDate(pinjamDate.getDate() + Number(lama_pinjam));
    const tanggal_kembali = pinjamDate.toISOString().split("T")[0];

    const [result] = await connection.execute(
      `INSERT INTO peminjaman (user_id, buku_id, tanggal_pinjam, tanggal_kembali, lama_pinjam, status) 
       VALUES (?, ?, ?, ?, ?, 'pending')`,
      [user_id, buku_id, tanggal_pinjam, tanggal_kembali, lama_pinjam]
    );

    return NextResponse.json(
      { message: "Peminjaman berhasil diajukan (pending)", id: result.insertId },
      { status: 201 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}
