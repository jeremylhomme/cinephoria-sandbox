import { exec } from "child_process";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local.test" });

const startBackend = () => {
  return new Promise((resolve, reject) => {
    const backend = exec("npm run start:backend");

    backend.stdout.on("data", (data) => {
      console.log(`Backend: ${data}`);
      if (data.includes("Server running on port")) {
        resolve();
      }
    });

    backend.stderr.on("data", (data) => {
      console.error(`Backend Error: ${data}`);
      reject(data);
    });

    backend.on("close", (code) => {
      console.log(`Backend process exited with code ${code}`);
      if (code !== 0) {
        reject(`Backend process exited with code ${code}`);
      }
    });
  });
};

const runTests = () => {
  return new Promise((resolve, reject) => {
    const tests = exec(
      "npx vitest tests/backend/functional --config ./vitest.config.cjs"
    );

    tests.stdout.on("data", (data) => {
      console.log(`Tests: ${data}`);
    });

    tests.stderr.on("data", (data) => {
      console.error(`Tests Error: ${data}`);
      reject(data);
    });

    tests.on("close", (code) => {
      console.log(`Tests process exited with code ${code}`);
      if (code !== 0) {
        reject(`Tests process exited with code ${code}`);
      } else {
        resolve();
      }
    });
  });
};

const main = async () => {
  try {
    await startBackend();
    await runTests();
    process.exit(0);
  } catch (error) {
    console.error("Error during local functional tests:", error);
    process.exit(1);
  }
};

main();
