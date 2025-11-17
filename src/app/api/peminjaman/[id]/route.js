import connection from "@/lib/database";
import { NextResponse } from "next/server";

export async function PUT(req, { params }) {
  try {
    const { status } = await req.json();

    await connection.execute(
      "UPDATE peminjaman SET status = ? WHERE id = ?",
      [status, params.id]
    );

    return NextResponse.json({ message: "Status berhasil diperbarui" });

  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}
