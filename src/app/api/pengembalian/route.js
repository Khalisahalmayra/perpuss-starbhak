import connection from "../../../../lib/database";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { peminjaman_id } = await req.json();

    if (!peminjaman_id) {
      return NextResponse.json(
        { message: "peminjaman_id wajib diisi" },
        { status: 400 }
      );
    }

    const tanggalKembali = new Date().toISOString().split("T")[0];

    const [peminjaman] = await connection.execute(
      "SELECT tanggal_pinjam FROM peminjaman WHERE id = ?",
      [peminjaman_id]
    );

    if (peminjaman.length === 0) {
      return NextResponse.json(
        { message: "Data peminjaman tidak ditemukan" },
        { status: 404 }
      );
    }

    // hitung lama pinjam
    const pinjam = new Date(peminjaman[0].tanggal_pinjam);
    const kembali = new Date(tanggalKembali);
    const selisihHari = Math.ceil((kembali - pinjam) / (1000 * 60 * 60 * 24));

    // update tabel peminjaman
    await connection.execute(
      `UPDATE peminjaman 
       SET tanggal_kembali=?, lama_pinjam=?
       WHERE id=?`,
      [tanggalKembali, selisihHari, peminjaman_id]
    );

    // masukkan ke tabel pengembalian
    await connection.execute(
      `INSERT INTO pengembalian (peminjaman_id, tanggal_dikembalikan, denda)
       VALUES (?, ?, ?)`,
      [peminjaman_id, tanggalKembali, 0] // denda = 0 default
    );

    return NextResponse.json({ message: "Buku berhasil dikembalikan" });

  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}
