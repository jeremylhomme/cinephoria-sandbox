import express from "express";
import {
  createOrUpdateBooking,
  getBooking,
  getBookingsCountLast7Days,
  updateBooking,
  deleteBooking,
  getBookings,
  resetBookingCounts,
  softDeleteBooking,
} from "../controllers/bookingController.js";
import {
  authenticatedUser,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

// Create or update a booking
router.route("/").post(authenticatedUser, createOrUpdateBooking);
router.route("/").put(authenticatedUser, createOrUpdateBooking);

// Get the number of bookings per movie for the last 7 days
router
  .route("/bookings-count-last-7-days")
  .get(authenticatedUser, authorizedAdmin, getBookingsCountLast7Days);

// Reset booking counts
router
  .route("/reset-counts")
  .put(authenticatedUser, authorizedAdmin, resetBookingCounts);

// Get a single booking by ID
router.route("/:id").get(authenticatedUser, getBooking);

// Update a booking
router.put("/:id", authenticatedUser, updateBooking);

// Soft delete a booking (for customers)
router.route("/soft-delete/:id").patch(authenticatedUser, softDeleteBooking);

// Delete a booking (for admins)
router.route("/:id").delete(authenticatedUser, authorizedAdmin, deleteBooking);

// Get all bookings
router.get("/", authenticatedUser, getBookings);

export default router;
