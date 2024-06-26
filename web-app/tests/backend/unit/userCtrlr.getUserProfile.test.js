import { describe, it, expect, vi } from "vitest";
import bcrypt from "bcryptjs";
import { updateUserProfile } from "../../../backend/controllers/userController.js";
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
    userPassword: "currentpassword",
    newPassword: "newpassword123",
    confirmUserPassword: "newpassword123",
  },
};

const mockRes = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn(),
};

describe("updateUserProfile Controller", () => {
  it("should return 400 if user ID format is invalid", async () => {
    const invalidReq = { ...mockReq, params: { id: "invalid" } };

    await updateUserProfile(invalidReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Invalid user ID format.",
    });
  });

  it("should return 404 if user is not found", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);

    await updateUserProfile(mockReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(404);
    expect(mockRes.json).toHaveBeenCalledWith({ message: "User not found." });
  });

  it("should return 401 if current password is incorrect", async () => {
    const currentUser = { id: 1, userPassword: "hashedpassword" };

    mockPrisma.user.findUnique.mockResolvedValue(currentUser);
    vi.spyOn(bcrypt, "compare").mockResolvedValue(false);

    await updateUserProfile(mockReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(401);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "Current password is incorrect.",
    });
  });

  it("should return 400 if new password and confirm password do not match", async () => {
    const mismatchedPasswordReq = {
      ...mockReq,
      body: { ...mockReq.body, confirmUserPassword: "differentpassword" },
    };
    const currentUser = { id: 1, userPassword: "hashedpassword" };

    mockPrisma.user.findUnique.mockResolvedValue(currentUser);
    vi.spyOn(bcrypt, "compare").mockResolvedValue(true);

    await updateUserProfile(mismatchedPasswordReq, mockRes, mockPrisma);

    expect(mockRes.status).toHaveBeenCalledWith(400);
    expect(mockRes.json).toHaveBeenCalledWith({
      message: "New password and confirm password do not match.",
    });
  });

  it("should return 200 with no changes message if no changes are made", async () => {
    const currentUser = {
      id: 1,
      userFirstName: "John",
      userLastName: "Doe",
      userEmail: "john.doe@example.com",
      userPassword: "hashedpassword",
    };

    const noChangeReq = {
      ...mockReq,
      body: {
        userPassword: undefined,
        newPassword: undefined,
        confirmUserPassword: undefined,
      },
    };

    mockPrisma.user.findUnique.mockResolvedValue(currentUser);
    mockPrisma.user.update.mockResolvedValue(currentUser);

    await updateUserProfile(noChangeReq, mockRes, mockPrisma);

    expect(mockRes.json).toHaveBeenCalledWith({
      id: currentUser.id,
      userFirstName: currentUser.userFirstName,
      userLastName: currentUser.userLastName,
      userEmail: currentUser.userEmail,
      userRole: currentUser.userRole,
      message: "No changes were made to the user profile.",
    });
  });

  it("should update the user profile successfully", async () => {
    const currentUser = {
      id: 1,
      userFirstName: "John",
      userLastName: "Doe",
      userEmail: "john.doe@example.com",
      userPassword: "hashedpassword",
    };

    const updatedUser = {
      ...currentUser,
      userFirstName: "John",
      userLastName: "Doe",
      userEmail: "john.doe@example.com",
      userPassword: "newhashedpassword",
    };

    mockPrisma.user.findUnique.mockResolvedValue(currentUser);
    vi.spyOn(bcrypt, "compare").mockResolvedValue(true);
    vi.spyOn(bcrypt, "hash").mockResolvedValue("newhashedpassword");
    mockPrisma.user.update.mockResolvedValue(updatedUser);

    await updateUserProfile(mockReq, mockRes, mockPrisma);

    expect(mockRes.json).toHaveBeenCalledWith({
      id: updatedUser.id,
      userFirstName: updatedUser.userFirstName,
      userLastName: updatedUser.userLastName,
      userEmail: updatedUser.userEmail,
      message: "User profile updated successfully.",
    });
  });
});
