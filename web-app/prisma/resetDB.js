import { exec } from "child_process";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Ensure you specify the correct path to the .env.dev file
dotenv.config({ path: path.resolve(process.cwd(), ".env.dev") });

const logFile = fs.createWriteStream("reset_db.log", { flags: "a" });

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

const resetDatabase = async () => {
  try {
    log("Resetting database...");
    await executeCommand(
      "npx prisma migrate reset --force --schema=prisma/schema.prisma --skip-seed"
    );
    log("Database reset successfully.");

    log("Applying migrations...");
    await executeCommand(
      "npx prisma migrate deploy --schema=prisma/schema.prisma"
    );
    log("Migrations applied successfully.");

    log("Seeding database...");
    await executeCommand("npm run seed:dev");
    log("Database seeded successfully.");
  } catch (error) {
    log(`Error: ${error}`);
    process.exit(1);
  }
};

resetDatabase();
