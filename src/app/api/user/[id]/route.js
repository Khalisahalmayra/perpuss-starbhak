import { NextResponse } from "next/server";
import pool from "@/lib/database";

export async function GET(req, context) {
  try {
    // params harus di-AWAIT sesuai aturan Next terbaru
    const { id } = await context.params;

    if (!id || id === "null" || id === "undefined") {
      return NextResponse.json(
        { error: "User ID tidak valid!" },
        { status: 400 }
      );
    }

    const [rows] = await pool.query(
      `SELECT id, namaLengkap, kelasJurusan, telepon, email, role 
       FROM users 
       WHERE id = ? 
       LIMIT 1`,
      [id]
    );

    if (rows.length === 0) {
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("ERROR GET USER:", err);
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}