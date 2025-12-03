import { NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import pool from "@/lib/database";
import { useSession } from "next-auth/react";

export async function GET(request) {
  try {
    const token = request.cookies.get("session")?.value;

    if (!token) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    const decoded = await verifyToken(token);

    if (!decoded?.id) {
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Ambil user lengkap dari database
    const [rows] = await pool.execute(
      `SELECT id, nama, kelas, email, role 
       FROM users 
       WHERE id = ?`,
      [decoded.id]
    );

    if (rows.length === 0) {
      return NextResponse.json({ user: null }, { status: 404 });
    }

    // Return user lengkap
    return NextResponse.json({ user: rows[0] }, { status: 200 });

  } catch (error) {
    console.error("API USER ERROR:", error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}
