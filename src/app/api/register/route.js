import pool from "@/lib/database";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { nama, kelas, email, password } = body;

    if (!nama || !email || !password) {
      return Response.json(
        { message: "Semua field wajib diisi!" },
        { status: 400 }
      );
    }

    const [exists] = await pool.execute(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (exists.length > 0) {
      return Response.json(
        { message: "Email sudah digunakan!" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.execute(
      "INSERT INTO users (nama, kelas, email, password, role) VALUES (?, ?, ?, ?, 'siswa')",
      [nama, kelas, email, hashed]
    );

    return Response.json(
      { message: "Registrasi berhasil!" },
      { status: 200 }
    );
  } catch (e) {
    console.error(e);
    return Response.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}
