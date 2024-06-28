import { exec } from "child_process";
import dotenv from "dotenv";
import fs from "fs";
import util from "util";

dotenv.config({ path: ".env" });

const execPromise = util.promisify(exec);
const logFile = fs.createWriteStream("backend_start.log", { flags: "a" });

const log = (message) => {
  console.log(message);
  logFile.write(`${message}\n`);
};

const startBackend = async () => {
  return new Promise((resolve, reject) => {
    const backend = exec("nodemon ./backend/server.js");

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

const checkDatabaseConnections = async () => {
  try {
    await execPromise("nc -zv mysql-db 3306");
    log("MySQL: Connection successful");
  } catch (error) {
    log(`MySQL Error: ${error}`);
    throw error;
  }

  try {
    await execPromise("nc -zv mongodb-db 27017");
    log("MongoDB: Connection successful");
  } catch (error) {
    log(`MongoDB Error: ${error}`);
    throw error;
  }
};

const main = async () => {
  try {
    await checkDatabaseConnections();
    await startBackend();
    process.stdin.resume();
  } catch (error) {
    log(`Error starting backend: ${error}`);
    process.exit(1);
  }
};

main();
