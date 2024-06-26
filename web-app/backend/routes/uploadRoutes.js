import express from "express";

import {
  uploadImage,
  uploadVideo,
  handleImageUpload,
  handleVideoUpload,
} from "../controllers/uploadController.js";

import {
  authenticatedUser,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post(
  "/movies/:id/image",
  authenticatedUser,
  authorizedAdmin,
  uploadImage,
  handleImageUpload
);

router.post(
  "/movies/:id/video",
  authenticatedUser,
  authorizedAdmin,
  uploadVideo,
  handleVideoUpload
);

export default router;
