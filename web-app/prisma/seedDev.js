import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  generatePassword,
} from "../backend/utils/userPasswordUtils.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });

const prisma = new PrismaClient();

async function createAdminUser() {
  const userFirstName = "Jeremy";
  const userLastName = "Dan";
  const userEmail = "dev.jeremylhomme@gmail.com";
  const userRole = "admin";

  try {
    const adminExists = await prisma.user.findFirst({
      where: {
        userRole: "admin",
      },
    });

    if (adminExists) {
      console.log("An admin user already exists.");
      return;
    }

    const userPassword = generatePassword();
    console.log("Generated Password: ", userPassword);

    const hashedPassword = await hashPassword(userPassword);
    if (!hashedPassword) {
      console.log("Failed to process userPassword, please try again.");
      return;
    }

    const newUser = await prisma.user.create({
      data: {
        userFirstName,
        userLastName,
        userEmail,
        userPassword: hashedPassword,
        userRole,
        mustChangePassword: true,
      },
    });

    console.log("Admin user created successfully.");
    console.log("Generated Password: ", userPassword);
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
}

createAdminUser()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
