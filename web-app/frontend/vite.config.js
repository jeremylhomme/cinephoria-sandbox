import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

export default defineConfig({
  plugins: [react()],
  define: {
    "process.env": process.env,
  },
  build: {
    outDir: path.resolve(__dirname, "dist"),
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
