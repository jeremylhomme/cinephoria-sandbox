import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginUser } from "../../../backend/controllers/userController.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

// Mocking Prisma Client
const mockPrisma = {
  User: {
    findUnique: vi.fn(),
  },
};

// Mocking Express req and res
const mockReq = {
  body: {
    userEmail: "test@example.com",
    userPassword: "password123",
  },
};

const mockRes = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
  cookie: vi.fn(),
};

describe("loginUser Controller", () => {
  it("should return 401 if user does not exist", async () => {
    mockPrisma.User.findUnique.mockResolvedValue(null);

    await loginUser(mockReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Mot de passe ou email invalide.",
    });
  });

  it("should return 401 if password is invalid", async () => {
    const existingUser = {
      id: 1,
      userFirstName: "John",
      userLastName: "Doe",
      userEmail: "test@example.com",
      userPassword: "hashedpassword",
      userRole: "user",
      userCreatedAt: new Date(),
    };

    mockPrisma.User.findUnique.mockResolvedValue(existingUser);
    vi.spyOn(bcrypt, "compare").mockResolvedValue(false);

    await loginUser(mockReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Mot de passe ou email invalide.",
    });
  });

  it("should return 200 and set cookie if password is valid", async () => {
    const existingUser = {
      id: 1,
      userFirstName: "John",
      userLastName: "Doe",
      userEmail: "test@example.com",
      userPassword: "hashedpassword",
      userRole: "user",
      userCreatedAt: new Date(),
    };

    mockPrisma.User.findUnique.mockResolvedValue(existingUser);
    vi.spyOn(bcrypt, "compare").mockResolvedValue(true);
    vi.spyOn(jwt, "sign").mockReturnValue("token");

    await loginUser(mockReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith({
      id: existingUser.id,
      userFirstName: existingUser.userFirstName,
      userLastName: existingUser.userLastName,
      userEmail: existingUser.userEmail,
      userRole: existingUser.userRole,
      userCreatedAt: existingUser.userCreatedAt,
    });
    expect(mockRes.cookie).toHaveBeenCalledWith(
      "jwt",
      "token",
      expect.objectContaining({
        path: "/",
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
    );
  });
});
