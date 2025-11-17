import connection from "@/lib/database";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = searchParams.get("limit");

    let query = "SELECT * FROM buku ORDER BY id DESC";
    if (limit) query += ` LIMIT ${parseInt(limit)}`;

    const [rows] = await connection.execute(query);

    return new Response(JSON.stringify(rows), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error mengambil data buku:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal mengambil data buku",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { img, judul, penulis, penerbit, tahun_terbit, stok, kategori } = body;

    console.log("DATA POST:", body);

    await connection.execute(
      `INSERT INTO buku (img, judul, penulis, penerbit, tahun_terbit, stok, kategori)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [img, judul, penulis, penerbit, tahun_terbit, stok, kategori]
    );

    return new Response(
      JSON.stringify({ message: "Buku berhasil ditambahkan" }),
      { status: 201 }
    );

  } catch (error) {
    console.error("SQL ERROR POST:", error);
    return new Response(
      JSON.stringify({ message: "Gagal menambahkan buku", error: error.message }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    console.log("DATA PUT:", body);

    const { id, img, judul, penulis, penerbit, tahun_terbit, stok, kategori } = body;

    await connection.execute(
      `UPDATE buku 
       SET img=?, judul=?, penulis=?, penerbit=?, tahun_terbit=?, stok=?, kategori=?
       WHERE id=?`,
      [img, judul, penulis, penerbit, tahun_terbit, stok, kategori, id]
    );

    return new Response(
      JSON.stringify({ message: "Buku berhasil diupdate" }),
      { status: 200 }
    );

  } catch (error) {
    console.error("SQL ERROR PUT:", error);
    return new Response(
      JSON.stringify({
        message: "Gagal mengupdate buku",
        error: error.message
      }),
      { status: 500 }
    );
  }
}
