import express from "express";
import {
  createRoom,
  getRooms,
  getRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/roomController.js";
import {
  authenticatedUser,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Routes for general room information
// Creation of a room is restricted to authenticated users with admin rights
router.post("/", authenticatedUser, authorizedAdmin, createRoom);

// Retrieves all rooms, open for all users to view
router.get("/", getRooms);

// Individual room operations (Read, Update, Delete)
// Getting a specific room by ID is open for all users
router.get("/:id", getRoom);

// Updating and deleting a room requires admin rights
router
  .route("/:id")
  .put(authenticatedUser, authorizedAdmin, updateRoom)
  .delete(authenticatedUser, authorizedAdmin, deleteRoom);

export default router;
