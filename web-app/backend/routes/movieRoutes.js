import express from "express";
import {
  authenticatedUser,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";
import {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
} from "../controllers/movieController.js";

const router = express.Router();

router
  .route("/")
  .get(getMovies)
  .post(authenticatedUser, authorizedAdmin, createMovie);

router
  .route("/:id")
  .get(getMovie)
  .put(authenticatedUser, authorizedAdmin, updateMovie)
  .delete(authenticatedUser, authorizedAdmin, deleteMovie);

export default router;
