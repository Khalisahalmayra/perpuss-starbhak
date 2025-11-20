import pool from "@/lib/database";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { id } = params;
    const { status } = await req.json();

    const [result] = await pool.execute(
      "UPDATE peminjaman SET status = ? WHERE id = ?",
      [status, id]
    );

    return NextResponse.json(
      { message: "Status berhasil diperbarui", result },
      { status: 200 }
    );
  } catch (error) {
    console.error("PATCH ERROR:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
