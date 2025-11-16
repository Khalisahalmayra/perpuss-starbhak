import connection from "@/app/lib/database";
import { NextResponse } from "next/server";

export async function GET(req, context) {
  try {
    const params = await context.params;

    if (!params?.id) {
      return NextResponse.json(
        { message: "Parameter ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const [rows] = await connection.execute(
      "SELECT * FROM buku WHERE id = ?",
      [params.id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { message: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0], { status: 200 });

  } catch (error) {
    console.error("ERROR API DETAIL:", error);
    return NextResponse.json(
      { message: "Internal server error", error: error.message },
      { status: 500 }
    );
  }
}

// =============================
//       DELETE BUKU
// =============================

export async function DELETE(req, context) {
  try {
    const params = await context.params;

    if (!params?.id) {
      return NextResponse.json(
        { message: "Parameter ID tidak ditemukan" },
        { status: 400 }
      );
    }

    const [result] = await connection.execute(
      "DELETE FROM buku WHERE id = ?",
      [params.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { message: "Buku tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Buku berhasil dihapus" },
      { status: 200 }
    );

  } catch (error) {
    console.error("ERROR DELETE BUKU:", error);
    return NextResponse.json(
      { message: "Gagal menghapus buku", error: error.message },
      { status: 500 }
    );
  }
}
