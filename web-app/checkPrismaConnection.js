import prisma from "./backend/config/prismaClient.js";

async function checkPrismaConnection() {
  try {
    await prisma.$connect();
    console.log("Prisma connected successfully");

    // Perform a simple query to check if the database is accessible
    const users = await prisma.user.findMany();
    console.log("Number of users in the database:", users.length);

    await prisma.$disconnect();
    console.log("Prisma disconnected successfully");
  } catch (error) {
    console.error("Error connecting to Prisma:", error);
  }
}

checkPrismaConnection();
