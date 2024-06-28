import { exec } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import mysql from "mysql2/promise";

// Load environment variables from .env.prod file
dotenv.config({ path: ".env.prod" });

const logFile = fs.createWriteStream("backend_start.log", { flags: "a" });

const log = (message) => {
  console.log(message);
  logFile.write(`${message}\n`);
};

const createDatabaseIfNotExists = async () => {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      port: process.env.MYSQL_PORT,
    });
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.MYSQL_DB}\`;`
    );
    await connection.end();
    log(`Database ${process.env.MYSQL_DB} ensured to exist`);
  } catch (error) {
    log(`Error creating database: ${error.message}`);
    process.exit(1);
  }
};

const runPrismaMigrations = () => {
  return new Promise((resolve, reject) => {
    const prisma = exec("npx prisma migrate deploy && npx prisma generate");

    prisma.stdout.on("data", (data) => {
      log(`Prisma: ${data}`);
    });

    prisma.stderr.on("data", (data) => {
      log(`Prisma Error: ${data}`);
    });

    prisma.on("close", (code) => {
      if (code !== 0) {
        reject(`Prisma process exited with code ${code}`);
      } else {
        resolve();
      }
    });
  });
};

const startBackend = () => {
  return new Promise((resolve, reject) => {
    const backend = exec("node ./backend/server.js");

    backend.stdout.on("data", (data) => {
      log(`Backend: ${data}`);
      if (data.includes("Server running on port")) {
        resolve(backend);
      }
    });

    backend.stderr.on("data", (data) => {
      log(`Backend Error: ${data}`);
    });

    backend.on("close", (code) => {
      log(`Backend process exited with code ${code}`);
      if (code !== 0) {
        reject(`Backend process exited with code ${code}`);
      }
    });
  });
};

const main = async () => {
  try {
    await createDatabaseIfNotExists();
    await runPrismaMigrations();
    await startBackend();
  } catch (error) {
    log(`Error starting backend: ${error}`);
    process.exit(1);
  }
};

main();
