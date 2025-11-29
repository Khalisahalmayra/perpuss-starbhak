import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/database";
import bcrypt from "bcryptjs";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",

      async authorize(credentials) {
        const { email, password } = credentials;

        const [rows] = await pool.execute(
          "SELECT * FROM users WHERE email = ? LIMIT 1",
          [email]
        );

        if (rows.length === 0) return null;

        const user = rows[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return null;

        return {
          id: user.id,
          email: user.email,
          nama: user.nama,
          kelas: user.kelas,
          role: user.role, // admin / user
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nama = user.nama;
        token.kelas = user.kelas;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.nama = token.nama;
      session.user.kelas = token.kelas;
      session.user.role = token.role;
      return session;
    },
  },

  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
};
