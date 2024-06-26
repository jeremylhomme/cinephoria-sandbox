import jwt from "jsonwebtoken";
import asyncHandler from "./asyncHandler.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getTokenFromRequest = (req) => {
  const bearerToken = req.headers.authorization;
  const token = bearerToken && bearerToken.split(" ")[1]; // Authorization: Bearer TOKEN
  return token || req.cookies.jwt;
};

const authenticatedUser = asyncHandler(async (req, res, next) => {
  const token = getTokenFromRequest(req);

  if (!token) {
    return res
      .status(401)
      .json({ error: "Not authorized, no token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        userFirstName: true,
        userLastName: true,
        userEmail: true,
        userRole: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Not authorized, token failed." });
  }
});

const authorizedAdmin = (req, res, next) => {
  if (req.user.userRole !== "admin") {
    return res
      .status(403)
      .json({ error: "Access denied. Admin role required." });
  }
  next();
};

export { authenticatedUser, authorizedAdmin };
