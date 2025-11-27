import pool from "@/lib/database";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { status } = await req.json();

    console.log("📌 ID:", id);
    console.log("📝 Status baru:", status);

    // Validasi status
    const validStatus = ['pending', 'dipinjam', 'dikembalikan', 'ditolak'];
    if (!status || !validStatus.includes(status)) {
      return NextResponse.json(
        { success: false, message: "Status tidak valid" },
        { status: 400 }
      );
    }

    const connection = await pool.getConnection();

    try {
      // Mulai transaction
      await connection.beginTransaction();

      // Ambil status lama dan buku_id
      const [peminjamanData] = await connection.execute(
        "SELECT status, buku_id FROM peminjaman WHERE id = ?",
        [id]
      );

      if (peminjamanData.length === 0) {
        await connection.rollback();
        connection.release();
        return NextResponse.json(
          { success: false, message: "Data peminjaman tidak ditemukan" },
          { status: 404 }
        );
      }

      const oldStatus = peminjamanData[0].status;
      const bukuId = peminjamanData[0].buku_id;

      console.log("📊 Status lama:", oldStatus);
      console.log("📚 Buku ID:", bukuId);

      // Update status peminjaman
      const [result] = await connection.execute(
        "UPDATE peminjaman SET status = ? WHERE id = ?",
        [status, id]
      );

      console.log("📊 Affected rows:", result.affectedRows);

      // Update stok buku berdasarkan perubahan status
      if (oldStatus === 'pending' && status === 'dipinjam') {
        // Kurangi stok saat konfirmasi peminjaman
        await connection.execute(
          "UPDATE buku SET stok = stok - 1 WHERE id = ? AND stok > 0",
          [bukuId]
        );
        console.log("✅ Stok dikurangi 1");
      } else if (oldStatus === 'dipinjam' && status === 'dikembalikan') {
        // Tambah stok saat buku dikembalikan
        await connection.execute(
          "UPDATE buku SET stok = stok + 1 WHERE id = ?",
          [bukuId]
        );
        console.log("✅ Stok ditambah 1");
      } else if (oldStatus === 'pending' && status === 'ditolak') {
        // Tidak perlu update stok karena buku belum dipinjam
        console.log("ℹ️ Peminjaman ditolak, stok tidak berubah");
      }

      // Commit transaction
      await connection.commit();
      connection.release();

      console.log("✅ Berhasil update status dan stok!");

      return NextResponse.json(
        { 
          success: true,
          message: "Status berhasil diperbarui",
          result 
        },
        { status: 200 }
      );

    } catch (error) {
      // Rollback jika ada error
      await connection.rollback();
      connection.release();
      throw error;
    }

  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error.message 
      },
      { status: 500 }
    );
  }
}