import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/database";
import bcrypt from "bcryptjs";

const handler = NextAuth({
  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,

  providers: [
    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      // ✅ PERBAIKAN 1: Update authorize() - GANTI YANG INI
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password harus diisi");
        }

        try {
          const [rows] = await pool.execute(
            "SELECT * FROM users WHERE email = ?",
            [credentials.email]
          );

          if (!Array.isArray(rows) || rows.length === 0) {
            throw new Error("Email tidak ditemukan");
          }

          const user = rows[0];
          
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordCorrect) {
            throw new Error("Password salah");
          }

          return {
            id: String(user.id), // Pastikan string
            nama: user.nama,
            kelas: user.kelas,
            role: user.role ?? "user",
            email: user.email,
          };
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.nama = user.nama;
        token.email = user.email;
        token.kelas = user.kelas;
        token.role = user.role;
      }
      return token;
      // localStorage.setItem("role", user.)
    },

    async session({ session, token }) {
      session.user = {
        id: token.id,
        nama: token.nama,
        kelas: token.kelas,
        email: token.email,
        role: token.role,
      };
      return session;
      
    },

    // ✅ PERBAIKAN 3: TAMBAHKAN callback redirect INI
    async redirect({ url, baseUrl }) {
      console.log("🔄 Redirect callback:", { url, baseUrl });
      
      // Jika url adalah relative path
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      
      // Jika url adalah callbackUrl yang sama dengan baseUrl
      if (new URL(url).origin === baseUrl) return url;
      
      return baseUrl;
    },
  },

  pages: {
    signIn: "/auth/Login",
    error: "/auth/Login",
  },

  debug: true,
});

export { handler as GET, handler as POST };