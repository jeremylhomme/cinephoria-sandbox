import { exec } from "child_process";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

dotenv.config({ path: path.resolve(process.cwd(), ".env.prod") });

const logFile = fs.createWriteStream("init_migrate_prod.log", { flags: "a" });

const log = (message) => {
  console.log(message);
  logFile.write(`${message}\n`);
};

const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    const process = exec(command);

    process.stdout.on("data", (data) => {
      log(data);
    });

    process.stderr.on("data", (data) => {
      log(data);
    });

    process.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(`Command failed with exit code ${code}`);
      }
    });
  });
};

const initMigrateProd = async () => {
  try {
    log("Initializing migration for production...");
    await executeCommand("npx prisma migrate dev --name init");
    log("Migration initialized successfully for production.");
  } catch (error) {
    log(`Error initializing migration: ${error}`);
    process.exit(1);
  }
};

initMigrateProd();
