import pool from "@/lib/database";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    console.log("🔵 PATCH Request diterima");
    
    const id = params.id;
    const body = await req.json();
    const status = body.status;
    
    console.log("📌 ID:", id, "Type:", typeof id);
    console.log("📝 Status:", status, "Type:", typeof status);

    if (!status) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Status tidak boleh kosong" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (!id) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "ID tidak ditemukan" }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const validStatus = ['pending', 'dipinjam', 'dikembalikan', 'ditolak'];
    if (!validStatus.includes(status)) {
      return new NextResponse(
        JSON.stringify({ success: false, message: `Status '${status}' tidak valid` }),
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    const connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      "UPDATE peminjaman SET status = ? WHERE id = ?",
      [status, id]
    );

    console.log("📊 Affected rows:", result.affectedRows);

    connection.release();

    if (result.affectedRows === 0) {
      return new NextResponse(
        JSON.stringify({ success: false, message: "Data peminjaman tidak ditemukan" }),
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log("✅ Berhasil update!");

    return new NextResponse(
      JSON.stringify({ 
        success: true, 
        message: `Status berhasil diubah menjadi ${status}` 
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error("❌ Error:", error);
    
    return new NextResponse(
      JSON.stringify({ 
        success: false,
        message: "Gagal mengupdate status", 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}