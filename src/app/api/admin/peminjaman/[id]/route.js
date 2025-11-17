import connection from "@/app/lib/database";
import { NextResponse } from "next/server";

export async function PATCH(req, { params }) {
  try {
    const { status } = await req.json();

    await connection.execute(
      "UPDATE peminjaman SET status = ? WHERE id = ?",
      [status, params.id]
    );

    return NextResponse.json({ message: "Status updated" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
