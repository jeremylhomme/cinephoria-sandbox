import express from "express";
import {
  createSession,
  getSessions,
  getSessionsForCinema,
  getSession,
  updateSession,
  deleteSession,
  createAvailableTimeRanges,
  getBookedTimeRanges,
  getAvailableTimeRanges,
} from "../controllers/sessionController.js";
import {
  authenticatedUser,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticatedUser, authorizedAdmin, createSession);

router.get("/", getSessions);

router.get("/cinema/:cinemaId", getSessionsForCinema);

// Add routes for booked and available time ranges
router.get("/booked-time-ranges", getBookedTimeRanges);
router.get("/available-time-ranges", getAvailableTimeRanges);

router
  .route("/:id")
  .get(getSession)
  .put(authenticatedUser, authorizedAdmin, updateSession)
  .delete(authenticatedUser, authorizedAdmin, deleteSession);

router
  .route("/available-time-ranges")
  .post(authenticatedUser, authorizedAdmin, createAvailableTimeRanges);

export default router;
