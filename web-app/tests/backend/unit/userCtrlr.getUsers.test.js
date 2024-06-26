import { describe, it, expect, vi } from "vitest";
import { PrismaClient } from "@prisma/client";
import asyncHandler from "../../../backend/middlewares/asyncHandler";
import { getUsers } from "../../../backend/controllers/userController";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

vi.mock("@prisma/client", () => ({
  PrismaClient: vi.fn().mockImplementation(() => ({
    user: {
      findMany: vi.fn(),
    },
  })),
}));

describe("getUsers", () => {
  it("should return all users", async () => {
    // Arrange
    const mockUsers = [
      {
        id: 1,
        userFirstName: "John",
        userLastName: "Doe",
        userEmail: "john.doe@example.com",
      },
      {
        id: 2,
        userFirstName: "Jane",
        userLastName: "Doe",
        userEmail: "jane.doe@example.com",
      },
    ];

    const mockPrisma = new PrismaClient();
    mockPrisma.user.findMany.mockResolvedValue(mockUsers);

    const mockReq = {};

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      headersSent: false,
    };

    // Act
    await asyncHandler((req, res) => getUsers(req, res, mockPrisma))(
      mockReq,
      mockRes
    );

    // Assert
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith();
    expect(mockRes.json).toHaveBeenCalledWith(mockUsers);
  });

  it("should return empty array if no users found", async () => {
    // Arrange
    const mockPrisma = new PrismaClient();
    mockPrisma.user.findMany.mockResolvedValue([]);

    const mockReq = {};

    const mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      headersSent: false,
    };

    // Act
    await asyncHandler((req, res) => getUsers(req, res, mockPrisma))(
      mockReq,
      mockRes
    );

    // Assert
    expect(mockPrisma.user.findMany).toHaveBeenCalledWith();
    expect(mockRes.json).toHaveBeenCalledWith([]);
  });
});
