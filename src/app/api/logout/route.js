export async function POST() {
  // Buat response
  const response = new Response(
    JSON.stringify({ message: "Logout berhasil" }),
    { status: 200 }
  );

  // Hapus cookie session dengan mengosongkan dan meng-expire
  response.headers.append(
    "Set-Cookie",
    [
      "session=;",                     // kosongkan value
      "Path=/;",                       // berlaku di seluruh app
      "HttpOnly;",                     // tidak bisa diakses JS
      "Secure;",                       // wajib di production (HTTPS)
      "SameSite=Lax;",                 // aman
      "Expires=Thu, 01 Jan 1970 00:00:00 GMT" // hapus cookie
    ].join(" ")
  );

  return response;
}
