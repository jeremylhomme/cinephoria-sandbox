import asyncHandler from "../middlewares/asyncHandler.js";
import bcrypt from "bcrypt";
import createToken from "../utils/createToken.js";
import { PrismaClient } from "@prisma/client";
import { hashPassword, generatePassword } from "../utils/userPasswordUtils.js";
import Booking from "../models/bookingModel.js";

const prisma = new PrismaClient();

const createUser = asyncHandler(async (req, res) => {
  const { userFirstName, userLastName, userEmail, userRole } = req.body;

  if (!userFirstName || !userLastName || !userEmail || !userRole) {
    return res
      .status(400)
      .json({ message: "Please fill all the inputs with valid information." });
  }

  const userExists = await prisma.user.findUnique({ where: { userEmail } });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "User already exists with the same userEmail." });
  }

  const userPassword = generatePassword();
  console.log("Generated Password: ", userPassword);

  const hashedPassword = await hashPassword(userPassword);
  if (!hashedPassword) {
    return res
      .status(500)
      .json({ message: "Failed to process userPassword, please try again." });
  }

  try {
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

    res.status(201).json({
      id: newUser.id,
      userFirstName: newUser.userFirstName,
      userLastName: newUser.userLastName,
      userEmail: newUser.userEmail,
      userRole: newUser.userRole,
      generatedPassword: userPassword,
      message: "User created successfully. Please note the generated password.",
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "Error creating user due to server issue.",
      error: error.message,
    });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { userFirstName, userLastName, userEmail, userPassword } = req.body;

  if (!userFirstName || !userLastName || !userEmail || !userPassword.trim()) {
    return res
      .status(400)
      .json({ message: "Please fill all the inputs with valid information." });
  }

  const userExists = await prisma.user.findUnique({ where: { userEmail } });
  if (userExists) {
    return res
      .status(400)
      .json({ message: "User already exists with the same userEmail." });
  }

  const hashedPassword = await hashPassword(userPassword);

  if (!hashedPassword) {
    return res
      .status(500)
      .json({ message: "Failed to process userPassword, please try again." });
  }

  try {
    const newUser = await prisma.user.create({
      data: {
        userFirstName,
        userLastName,
        userEmail,
        userPassword: hashedPassword,
        userRole: "customer",
      },
    });

    createToken(res, newUser.id);

    res.status(201).json({
      id: newUser.id,
      userFirstName: newUser.userFirstName,
      userLastName: newUser.userLastName,
      userEmail: newUser.userEmail,
      userRole: newUser.userRole,
      message: "User registered successfully and token issued.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Error registering user due to server issue.",
      error: error.message,
    });
  }
});

const getUsers = asyncHandler(async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

const getUserProfile = asyncHandler(async (req, res) => {
  const id = parseInt(req.params.id);
  const user = await prisma.user.findUnique({ where: { id: id } });
  if (user) {
    res.json({
      id: user.id,
      userFirstName: user.userFirstName,
      userLastName: user.userLastName,
      userEmail: user.userEmail,
      mustChangePassword: user.mustChangePassword,
    });
  } else {
    res.status(404).json({ message: "User not found." });
  }
});

const loginUser = asyncHandler(async (req, res) => {
  const { userEmail, userPassword } = req.body;

  const existingUser = await prisma.user.findUnique({ where: { userEmail } });

  if (existingUser) {
    const isPasswordValid = await bcrypt.compare(
      userPassword,
      existingUser.userPassword
    );

    if (isPasswordValid) {
      createToken(res, existingUser.id);

      res.status(200).json({
        id: existingUser.id,
        userFirstName: existingUser.userFirstName,
        userLastName: existingUser.userLastName,
        userEmail: existingUser.userEmail,
        userRole: existingUser.userRole,
        userCreatedAt: existingUser.userCreatedAt,
        mustChangePassword: existingUser.mustChangePassword,
      });
      return;
    }
  }

  res.status(401).json({ message: "Invalid email or password." });
});

const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userFirstName, userLastName, userEmail, userRole, userPassword } =
    req.body;

  const userId = parseInt(id);
  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    const updateData = {
      userFirstName,
      userLastName,
      userEmail,
      userRole,
    };

    if (userPassword) {
      updateData.userPassword = await bcrypt.hash(userPassword, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({
      id: updatedUser.id,
      userFirstName: updatedUser.userFirstName,
      userLastName: updatedUser.userLastName,
      userEmail: updatedUser.userEmail,
      userRole: updatedUser.userRole,
      message: "User updated successfully.",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Failed to update user profile",
      error: error.message,
    });
  }
});

const updateUserProfile = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    userFirstName,
    userLastName,
    userEmail,
    userPassword,
    newPassword,
    confirmUserPassword,
  } = req.body;
  const userId = parseInt(id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID format." });
  }

  try {
    const currentUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found." });
    }

    if (userPassword) {
      const isMatch = await bcrypt.compare(
        userPassword,
        currentUser.userPassword
      );
      if (!isMatch) {
        return res
          .status(401)
          .json({ message: "Current password is incorrect." });
      }
    }

    if (
      newPassword &&
      (!confirmUserPassword || newPassword !== confirmUserPassword)
    ) {
      return res
        .status(400)
        .json({ message: "New password and confirm password do not match." });
    }

    const updateData = {
      userFirstName: userFirstName || currentUser.userFirstName,
      userLastName: userLastName || currentUser.userLastName,
      userEmail: userEmail || currentUser.userEmail,
    };

    if (newPassword) {
      const hashedPassword = await hashPassword(newPassword);
      updateData.userPassword = hashedPassword;
    }

    const hasChanges =
      updateData.userFirstName !== currentUser.userFirstName ||
      updateData.userLastName !== currentUser.userLastName ||
      updateData.userEmail !== currentUser.userEmail ||
      newPassword;

    if (!hasChanges) {
      return res.json({
        id: currentUser.id,
        userFirstName: currentUser.userFirstName,
        userLastName: currentUser.userLastName,
        userEmail: currentUser.userEmail,
        userRole: currentUser.userRole,
        message: "No changes were made to the user profile.",
      });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    res.json({
      id: updatedUser.id,
      userFirstName: updatedUser.userFirstName,
      userLastName: updatedUser.userLastName,
      userEmail: updatedUser.userEmail,
      message: "User profile updated successfully.",
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Failed to update user profile",
      error: error.message,
    });
  }
});

const updateUserPassword = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { newPassword } = req.body;

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { id: parseInt(id, 10) },
    data: { userPassword: hashedPassword, mustChangePassword: false },
  });

  res.status(200).json({ message: "Password updated successfully" });
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = parseInt(req.params.id, 10);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user ID" });
  }

  try {
    await prisma.user.delete({ where: { id: userId } });
    res.json({ message: "User deleted successfully." });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error deleting user. Please try again later." });
  }
});

const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successful." });
});

const getUserBookings = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId, 10) },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const userIdString = userId.toString();

    const bookings = await Booking.find({ userId: userIdString }).sort({
      createdAt: -1,
    });

    if (bookings.length === 0) {
      return res
        .status(200)
        .json({ message: "No bookings found for this user." });
    }

    const detailedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const movie = await prisma.movie.findUnique({
          where: { id: parseInt(booking.movieId, 10) },
          select: {
            movieTitle: true,
            movieImg: true,
          },
        });

        const session = await prisma.session.findUnique({
          where: { id: parseInt(booking.sessionId, 10) },
          select: {
            timeRanges: {
              select: {
                timeRangeStartTime: true,
                timeRangeEndTime: true,
              },
            },
            room: {
              select: {
                id: true,
                roomNumber: true,
                cinema: {
                  select: {
                    id: true,
                    cinemaName: true,
                    cinemaAddress: true,
                    cinemaCity: true,
                    cinemaPostalCode: true,
                    cinemaCountry: true,
                  },
                },
              },
            },
          },
        });

        return {
          ...booking.toObject(),
          movie,
          session: {
            ...session,
            room: {
              id: session.room.id,
              roomNumber: session.room.roomNumber,
            },
            cinema: {
              id: session.room.cinema.id,
              cinemaName: session.room.cinema.cinemaName,
              cinemaAddress: session.room.cinema.cinemaAddress,
              cinemaCity: session.room.cinema.cinemaCity,
              cinemaPostalCode: session.room.cinema.cinemaPostalCode,
              cinemaCountry: session.room.cinema.cinemaCountry,
            },
          },
        };
      })
    );

    res.json(detailedBookings);
  } catch (error) {
    console.error("Error retrieving user bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export {
  createUser,
  registerUser,
  getUsers,
  getUserBookings,
  getUserProfile,
  loginUser,
  updateUserProfile,
  updateUser,
  updateUserPassword,
  deleteUser,
  logoutUser,
};
