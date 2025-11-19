import pool from "@/lib/database";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { status } = await req.json();

    await pool.execute(
      "UPDATE peminjaman SET status = ? WHERE id = ?",
      [status, params.id]
    );

    return NextResponse.json(
      { message: "Status berhasil diperbarui" },
      { status: 200 }
    );

  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan", error: error.message },
      { status: 500 }
    );
  }
}
