import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { registerUser } from "../../../backend/controllers/userController";
import { PrismaClient } from "@prisma/client";
import hashPassword from "../../../backend/utils/userPasswordUtils";
import createToken from "../../../backend/utils/createToken";

const prisma = new PrismaClient();

// Mock the modules
vi.mock("../../../backend/utils/userPasswordUtils.js", () => ({
  default: vi.fn(),
}));

vi.mock("../../../backend/utils/createToken.js", () => ({
  default: vi.fn(),
}));

describe("User Creation", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        userFirstName: "Test",
        userLastName: "User",
        userEmail: "testuser@example.com",
        userPassword: "password123",
      },
    };

    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      cookie: vi.fn().mockReturnThis(),
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("registerUser should create a new user with valid input", async () => {
    const mockHashPassword = hashPassword.mockResolvedValue("hashedPassword");
    const mockCreateToken = createToken.mockImplementation(() => {});
    const mockCreate = vi.spyOn(prisma.user, "create").mockResolvedValue({
      id: 1,
      userFirstName: "Test",
      userLastName: "User",
      userEmail: "testuser@example.com",
    });
    const mockFindUnique = vi
      .spyOn(prisma.user, "findUnique")
      .mockResolvedValue(null);

    await registerUser(req, res, prisma);

    expect(mockHashPassword).toHaveBeenCalledWith(req.body.userPassword);
    expect(mockCreateToken).toHaveBeenCalledWith(res, expect.any(Number));
    expect(mockCreate).toHaveBeenCalled();
    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { userEmail: req.body.userEmail },
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: expect.any(Number),
      userFirstName: req.body.userFirstName,
      userLastName: req.body.userLastName,
      userEmail: req.body.userEmail,
      message: "User registered successfully and token issued.",
    });
  });

  test("should return 400 if required fields are missing for registerUser", async () => {
    req.body.userFirstName = "";

    await registerUser(req, res, prisma);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Please fill all the inputs with valid information.",
    });
  });

  test("should return 400 if user already exists for registerUser", async () => {
    const mockHashPassword = hashPassword.mockResolvedValue("hashedPassword");
    const mockFindUnique = vi
      .spyOn(prisma.user, "findUnique")
      .mockResolvedValue({
        id: 1,
        userFirstName: "Test",
        userLastName: "User",
        userEmail: "testuser@example.com",
        userPassword: "hashedPassword",
      });

    await registerUser(req, res, prisma);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "User already exists with the same userEmail.",
    });

    mockHashPassword.mockRestore();
  });

  test("should return 500 if an error occurs during user creation due to hashing failure", async () => {
    const mockHashPassword = hashPassword.mockResolvedValue(null); // Simulate hashing failure
    const mockFindUnique = vi
      .spyOn(prisma.user, "findUnique")
      .mockResolvedValue(null); // Ensure no user exists

    await registerUser(req, res, prisma);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Failed to process userPassword, please try again.",
    });
  });

  test("should return 500 if an error occurs during user creation due to database error", async () => {
    const mockHashPassword = hashPassword.mockResolvedValue("hashedPassword");
    const mockCreate = vi
      .spyOn(prisma.user, "create")
      .mockRejectedValue(new Error("Database error"));
    const mockFindUnique = vi
      .spyOn(prisma.user, "findUnique")
      .mockResolvedValue(null);

    await registerUser(req, res, prisma);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error registering user due to server issue.",
      error: "Database error",
    });

    mockCreate.mockRestore();
  });
});
