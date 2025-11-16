import connection from "../../lib/database";
import bcrypt from "bcryptjs"; // untuk hash password

export async function POST(req) {
  try {
    const body = await req.json();
    const { nama, kelas, email, password } = body;

    // Validasi input
    if (!nama || !email || !password) {
      return new Response(
        JSON.stringify({ message: "Data tidak lengkap" }),
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database (default role = siswa)
    await connection.execute(
      "INSERT INTO users (nama, kelas, email, password, role) VALUES (?, ?, ?, ?, ?)",
      [nama, kelas || null, email, hashedPassword, "siswa"]
    );

    return new Response(
      JSON.stringify({ message: "Registrasi berhasil" }),
      { status: 201 }
    );

  } catch (error) {
    console.error("Error register:", error);

    // Jika email duplikat (duplicate entry error)
    if (error.code === "ER_DUP_ENTRY") {
      return new Response(
        JSON.stringify({ message: "Email sudah terdaftar" }),
        { status: 409 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Terjadi kesalahan server" }),
      { status: 500 }
    );
  }
}
