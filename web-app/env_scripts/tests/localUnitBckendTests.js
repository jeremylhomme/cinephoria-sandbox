import { exec } from "child_process";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config({ path: ".env.local.test" });

const logFile = fs.createWriteStream("unit_tests.log", { flags: "a" });

const log = (message) => {
  console.log(message);
  logFile.write(`${message}\n`);
};

const runMigrations = () => {
  return new Promise((resolve, reject) => {
    const migrate = exec("npx prisma migrate dev");

    migrate.stdout.on("data", (data) => {
      log(`Migrations: ${data}`);
    });

    migrate.stderr.on("data", (data) => {
      log(`Migrations Error: ${data}`);
    });

    migrate.on("close", (code) => {
      log(`Migrations process exited with code ${code}`);
      if (code !== 0) {
        reject(`Migrations process exited with code ${code}`);
      } else {
        resolve();
      }
    });
  });
};

const startBackend = () => {
  return new Promise((resolve, reject) => {
    const backend = exec("npm run backend");

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

const runTests = () => {
  return new Promise((resolve, reject) => {
    const tests = exec(
      "npx vitest tests/backend/unit --config ./vitest.config.cjs"
    );

    tests.stdout.on("data", (data) => {
      log(`Tests: ${data}`);
    });

    tests.stderr.on("data", (data) => {
      log(`Tests Error: ${data}`);
    });

    tests.on("close", (code) => {
      log(`Tests process exited with code ${code}`);
      if (code !== 0) {
        reject(`Tests process exited with code ${code}`);
      } else {
        resolve();
      }
    });
  });
};

const main = async () => {
  let backendProcess;
  try {
    await runMigrations();
    backendProcess = await startBackend();
    await runTests();
    process.exit(0);
  } catch (error) {
    log(`Error during local unit tests: ${error}`);
    process.exit(1);
  } finally {
    if (backendProcess) {
      backendProcess.kill();
    }
  }
};

main();
