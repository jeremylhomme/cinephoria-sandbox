import express from "express";
import {
  createUser,
  registerUser,
  loginUser,
  logoutUser,
  getUsers,
  getUserProfile,
  deleteUser,
  updateUser,
  updateUserProfile,
  updateUserPassword,
  getUserBookings,
} from "../controllers/userController.js";
import {
  authenticatedUser,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

import { PrismaClient } from "@prisma/client";

const router = express.Router();
const prisma = new PrismaClient();

// Routes for visitors
router.post("/register", (req, res) => registerUser(req, res, prisma));
router.post("/login", (req, res) => loginUser(req, res, prisma));

// Routes for logged in users
router.post("/logout", authenticatedUser, logoutUser);
router
  .route("/profile/:id")
  .get(authenticatedUser, (req, res) => getUserProfile(req, res, prisma))
  .put(authenticatedUser, (req, res) => updateUserProfile(req, res, prisma));

router
  .route("/:id/update-password")
  .put(authenticatedUser, (req, res) => updateUserPassword(req, res, prisma));

router
  .route("/:userId/bookings")
  .get(authenticatedUser, (req, res) => getUserBookings(req, res, prisma));

// Routes for admins
router
  .route("/")
  .post(authenticatedUser, authorizedAdmin, (req, res) =>
    createUser(req, res, prisma)
  )
  .get(authenticatedUser, authorizedAdmin, (req, res) =>
    getUsers(req, res, prisma)
  );

router
  .route("/:id")
  .put(authenticatedUser, authorizedAdmin, (req, res) =>
    updateUser(req, res, prisma)
  )
  .delete(authenticatedUser, authorizedAdmin, (req, res) =>
    deleteUser(req, res, prisma)
  );

export default router;
