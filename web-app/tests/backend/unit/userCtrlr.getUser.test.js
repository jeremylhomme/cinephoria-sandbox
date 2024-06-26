import { describe, it, expect, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../backend/middlewares/asyncHandler";
import { getUser } from "../../../backend/controllers/userController";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findUnique: vi.fn(),
    },
  })),
}));

describe("getUser", () => {
  it("should return user profile", async () => {
    // Arrange
    const mockUser = {
      id: 1,
      userFirstName: "John",
      userLastName: "Doe",
      userEmail: "john.doe@example.com",
      userRole: "customer",
    };

    const mockPrisma = new PrismaClient();
    mockPrisma.user.findUnique.mockResolvedValue(mockUser);

    const mockReq = {
      params: {
        id: "1",
      },
    };

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      headersSent: false,
    };

    // Act
    await asyncHandler((req, res) => getUser(req, res, mockPrisma))(
      mockReq,
      mockRes
    );

    // Assert
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockRes.json).toHaveBeenCalledWith({
      id: mockUser.id,
      userFirstName: mockUser.userFirstName,
      userLastName: mockUser.userLastName,
      userEmail: mockUser.userEmail,
      userRole: mockUser.userRole,
    });
  });

  it("should return 404 if user not found", async () => {
    // Arrange
    const mockPrisma = new PrismaClient();
    mockPrisma.user.findUnique.mockResolvedValue(null);

    const mockReq = {
      params: {
        id: "1",
      },
    };

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      headersSent: false,
    };

    // Act
    await asyncHandler((req, res) => getUser(req, res, mockPrisma))(
      mockReq,
      mockRes
    );

    // Assert
    expect(mockPrisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
    });
    expect(mockRes.status).toHaveBeenCalledWith(404);
  });
});
