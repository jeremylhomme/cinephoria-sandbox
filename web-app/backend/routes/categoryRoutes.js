import express from "express";
import {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} from "../controllers/categoryController.js";

import {
  authenticatedUser,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router
  .route("/")
  .post(authenticatedUser, authorizedAdmin, createCategory)
  .get(getCategories);

router
  .route("/:id")
  .get(getCategory) // Open for all users
  .put(authenticatedUser, authorizedAdmin, updateCategory)
  .delete(authenticatedUser, authorizedAdmin, deleteCategory);

export default router;
