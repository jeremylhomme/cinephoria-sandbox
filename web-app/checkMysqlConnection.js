import mysql from "mysql2";

const connection = mysql.createConnection({
  host: "mysql-db",
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "sql_cinephoria_test",
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL");

  connection.query("SHOW TABLES;", (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return;
    }
    console.log("Tables:", results);
    connection.end();
  });
});
