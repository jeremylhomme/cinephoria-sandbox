import express from "express";
const router = express.Router();

import {
  getCinemas,
  getCinema,
  createCinema,
  updateCinema,
  deleteCinema,
} from "../controllers/cinemaController.js";

import {
  authenticatedUser,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

router
  .route("/")
  .post(authenticatedUser, authorizedAdmin, createCinema)
  .get(getCinemas); // Open for all users

router
  .route("/:id")
  .get(getCinema) // Open for all users
  .put(authenticatedUser, authorizedAdmin, updateCinema)
  .delete(authenticatedUser, authorizedAdmin, deleteCinema);

export default router;
