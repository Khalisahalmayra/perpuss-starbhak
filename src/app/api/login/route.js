import connection from "../../lib/database";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    // Validasi input
    if (!email || !password) {
      return new Response(JSON.stringify({ message: "Email dan password wajib diisi" }), {
        status: 400,
      });
    }

    // Cek apakah user ada
    const [rows] = await connection.execute("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0) {
      return new Response(JSON.stringify({ message: "Email tidak ditemukan" }), { status: 404 });
    }

    const user = rows[0];

    // Cek password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return new Response(JSON.stringify({ message: "Password salah" }), { status: 401 });
    }

    // Jangan kirim password ke frontend
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
    return new Response(JSON.stringify({ message: "Terjadi kesalahan server" }), { status: 500 });
  }
}
