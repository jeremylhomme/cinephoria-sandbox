import { PrismaClient } from "@prisma/client";
import {
  hashPassword,
  generatePassword,
} from "../backend/utils/userPasswordUtils.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from .env.dev
dotenv.config({ path: path.resolve(__dirname, "../.env.dev") });

const prisma = new PrismaClient();

async function createAdminUser() {
  const userFirstName = "Jeremy";
  const userLastName = "Dan";
  const userEmail = "jeremy@gmail.com";
  const userRole = "admin";

  const userExists = await prisma.user.findUnique({ where: { userEmail } });
  if (userExists) {
    console.log("User already exists with the same userEmail.");
    return;
  }

  const userPassword = generatePassword();
  console.log("Generated Password: ", userPassword);

  const hashedPassword = await hashPassword(userPassword);
  if (!hashedPassword) {
    console.log("Failed to process userPassword, please try again.");
    return;
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        userFirstName,
        userLastName,
        userEmail,
        userPassword: hashedPassword,
        userRole,
        mustChangePassword: true, // Set this field
      },
    });

    console.log("User created successfully.");
    console.log("Generated Password: ", userPassword); // Log the generated password
  } catch (error) {
    console.error("Error creating user:", error);
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
