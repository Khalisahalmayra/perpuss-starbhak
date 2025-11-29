import pool from "@/lib/database";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-in-production"
);

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return new Response(
        JSON.stringify({ message: "Email dan password wajib diisi" }),
        { status: 400 }
      );
    }

    const [rows] = await pool.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return new Response(
        JSON.stringify({ message: "Email tidak ditemukan" }),
        { status: 404 }
      );
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return new Response(
        JSON.stringify({ message: "Password salah" }),
        { status: 401 }
      );
    }

    // Buat JWT
    const token = await new SignJWT({
      id: user.id,
      email: user.email,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(SECRET_KEY);

    // FIX: cookies() harus di-await di Next.js 16
    const cookieStore = await cookies();
    cookieStore.set("session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: "/",
    });

    const { password: _, ...safeUser } = user;

    return new Response(
      JSON.stringify({
        message: "Login berhasil",
        user: safeUser,
      }),
      { status: 200 }
    );

  } catch (error) {
    console.error("Error login:", error);
    return new Response(
      JSON.stringify({ message: "Terjadi kesalahan server" }),
      { status: 500 }
    );
  }
}
