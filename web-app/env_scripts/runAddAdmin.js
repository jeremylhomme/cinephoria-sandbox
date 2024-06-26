import { exec } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the .env.dev file
const envPath = path.resolve(__dirname, "../.env.dev");

// Path to the addAdmin.js script
const addAdminScriptPath = path.resolve(
  __dirname,
  "../node_scripts/addAdmin.js"
);

// Command to run addAdmin.js with the environment file
const command = `npx dotenv -e ${envPath} -- node ${addAdminScriptPath}`;

const runScript = () => {
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`);
      return;
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`);
      return;
    }
    console.log(`Stdout: ${stdout}`);
  });
};

runScript();
