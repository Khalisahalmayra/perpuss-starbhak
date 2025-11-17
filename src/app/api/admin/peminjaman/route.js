import connection from "@/lib/database";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [rows] = await connection.execute(`
      SELECT 
        p.id,
        p.status,
        u.nama AS user_nama,
        u.kelas AS user_kelas,
        
        -- users tidak punya kolom foto
        NULL AS user_img,
        
        b.judul AS buku_judul,

        -- kolom gambar buku = img
        b.img AS buku_img
        
      FROM peminjaman p
      JOIN users u ON p.user_id = u.id
      JOIN buku b ON p.buku_id = b.id
      ORDER BY p.id DESC
    `);

    return NextResponse.json(rows, { status: 200 });

  } catch (error) {
    console.error("ERROR GET PEMINJAMAN:", error);
    
    return NextResponse.json([], { status: 500 });
  }
}
