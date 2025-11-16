import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "ayra2009",
  database: "db_perpusaas",
  waitForConnections: true,
  connectionLimit: 10,
});

export default pool;
