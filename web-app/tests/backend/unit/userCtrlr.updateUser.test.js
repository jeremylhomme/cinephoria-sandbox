import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import { updateUser } from "../../../backend/controllers/userController.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env.test" });

// Mocking Prisma Client
const mockPrisma = {
  user: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
};

// Mocking Express req and res
const mockReq = {
  params: {
    id: "1",
  },
  body: {
    userFirstName: "John",
    userLastName: "Doe",
    userEmail: "john.doe@example.com",
    userRole: "customer",
    userPassword: "newpassword123",
  },
};

const mockRes = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
};

describe("updateUser Controller", () => {
  it("should return 400 if user ID format is invalid", async () => {
    const invalidReq = { ...mockReq, params: { id: "invalid" } };

    await updateUser(invalidReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid user ID format.",
    });
  });

  it("should return 404 if user is not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await updateUser(mockReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found." });
  });

  it("should return 500 if there is an update error", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 1 });
    mockPrisma.user.update.mockRejectedValue(new Error("Update failed"));

    await updateUser(mockReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Failed to update user profile",
      error: "Update failed",
    });
  });

  it("should update the user and return the updated user data", async () => {
    const currentUser = { id: 1 };
    const updatedUser = {
      id: 1,
      userFirstName: "John",
      userLastName: "Doe",
      userEmail: "john.doe@example.com",
      userRole: "customer",
    };

    mockPrisma.user.findUnique.mockResolvedValue(currentUser);
    vi.spyOn(bcrypt, "hash").mockResolvedValue("hashedpassword");
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    await updateUser(mockReq, mockRes, mockPrisma);

    expect(mockRes.json).toHaveBeenCalledWith({
      id: updatedUser.id,
      userFirstName: updatedUser.userFirstName,
      userLastName: updatedUser.userLastName,
      userEmail: updatedUser.userEmail,
      userRole: updatedUser.userRole,
      message: "User updated successfully.",
    });
  });

  it("should update the user without password and return the updated user data", async () => {
    const currentUser = { id: 1 };
    const updatedUser = {
      id: 1,
      userFirstName: "John",
      userLastName: "Doe",
      userEmail: "john.doe@example.com",
      userRole: "customer",
    };

    const reqWithoutPassword = {
      ...mockReq,
      body: { ...mockReq.body, userPassword: undefined },
    };

    mockPrisma.user.findUnique.mockResolvedValue(currentUser);
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    await updateUser(reqWithoutPassword, mockRes, mockPrisma);

    expect(mockRes.json).toHaveBeenCalledWith({
      id: updatedUser.id,
      userFirstName: updatedUser.userFirstName,
      userLastName: updatedUser.userLastName,
      userEmail: updatedUser.userEmail,
      userRole: updatedUser.userRole,
      message: "User updated successfully.",
    });
  });
});
