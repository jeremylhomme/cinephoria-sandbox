import multer from "multer";
import fs from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to create storage configuration
const getStorage = () =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      // Directory path for images
      const dir = join(__dirname, "..", "uploads", "movies", "images");
      fs.mkdirSync(dir, { recursive: true }); // Ensure directory exists
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const movieId = req.params.id;
      const extension = file.originalname.split(".").pop().toLowerCase();
      cb(null, `${movieId}-image.${extension}`); // Use movieId for file name
    },
  });

// Function to create storage configuration for videos
const getVideoStorage = () =>
  multer.diskStorage({
    destination: function (req, file, cb) {
      // Directory path for videos
      const dir = join(__dirname, "..", "uploads", "movies", "videos");
      fs.mkdirSync(dir, { recursive: true }); // Ensure directory exists
      cb(null, dir);
    },
    filename: function (req, file, cb) {
      const movieId = req.params.id;
      const extension = file.originalname.split(".").pop().toLowerCase();
      cb(null, `${movieId}-video.${extension}`); // Use movieId for file name
    },
  });

const handleImageUpload = async (req, res) => {
  if (!req.file) {
    console.error("No file uploaded");
    return res.status(400).send("No file uploaded.");
  }

  const validImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];
  const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
  const validExtensions = ["jpeg", "jpg", "png", "webp"];

  if (
    !validImageTypes.includes(req.file.mimetype) ||
    !validExtensions.includes(fileExtension)
  ) {
    console.error(
      `Invalid file type: ${req.file.mimetype} or extension: ${fileExtension}`
    );
    return res
      .status(400)
      .send(
        `Invalid file type. Please upload only ${validImageTypes.join(
          ", "
        )} files for image.`
      );
  }

  const movieId = parseInt(req.params.id, 10);
  if (isNaN(movieId)) {
    console.error("Invalid movie ID");
    return res.status(400).send("Invalid movie ID");
  }

  // Check if the movie exists
  const existingMovie = await prisma.movie.findUnique({
    where: { id: movieId },
  });
  if (!existingMovie) {
    console.error("Movie not found");
    return res.status(404).send("Movie not found");
  }

  const filename = `${movieId}-image.${fileExtension}`;
  try {
    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: { movieImg: filename },
    });

    res
      .status(200)
      .json({ message: "File uploaded successfully", filePath: req.file.path });
  } catch (error) {
    console.error("Error updating movie image:", error);
    res.status(500).send("Error updating movie image.");
  }
};

const handleVideoUpload = async (req, res) => {
  if (!req.file) {
    console.error("No file uploaded");
    return res.status(400).send("No file uploaded.");
  }

  const validVideoTypes = ["video/mp4", "video/avi", "video/mkv"];
  const fileExtension = req.file.originalname.split(".").pop().toLowerCase();
  const validExtensions = ["mp4", "avi", "mkv"];

  if (
    !validVideoTypes.includes(req.file.mimetype) ||
    !validExtensions.includes(fileExtension)
  ) {
    console.error(
      `Invalid file type: ${req.file.mimetype} or extension: ${fileExtension}`
    );
    return res
      .status(400)
      .send(
        `Invalid file type. Please upload only ${validVideoTypes.join(
          ", "
        )} files for video.`
      );
  }

  const movieId = parseInt(req.params.id, 10);
  if (isNaN(movieId)) {
    console.error("Invalid movie ID");
    return res.status(400).send("Invalid movie ID");
  }

  // Check if the movie exists
  const existingMovie = await prisma.movie.findUnique({
    where: { id: movieId },
  });
  if (!existingMovie) {
    console.error("Movie not found");
    return res.status(404).send("Movie not found");
  }

  const filename = `${movieId}-video.${fileExtension}`;
  try {
    const updatedMovie = await prisma.movie.update({
      where: { id: movieId },
      data: { movieTrailerUrl: filename },
    });

    res
      .status(200)
      .json({ message: "File uploaded successfully", filePath: req.file.path });
  } catch (error) {
    console.error("Error updating movie video:", error);
    res.status(500).send("Error updating movie video.");
  }
};

// Separate upload configurations for images
const uploadImage = multer({
  storage: getStorage(),
  fileFilter: (req, file, cb) => {
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const validExtensions = ["jpeg", "jpg", "png", "webp"];
    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    if (
      !validImageTypes.includes(file.mimetype) ||
      !validExtensions.includes(fileExtension)
    ) {
      return cb(
        new Error(
          `Invalid file type. Please upload only ${validImageTypes.join(
            ", "
          )} files for image.`
        ),
        false
      );
    }
    cb(null, true);
  },
}).single("image");

// Separate upload configurations for videos
const uploadVideo = multer({
  storage: getVideoStorage(),
  fileFilter: (req, file, cb) => {
    const validVideoTypes = ["video/mp4", "video/avi", "video/mkv"];
    const validExtensions = ["mp4", "avi", "mkv"];
    const fileExtension = file.originalname.split(".").pop().toLowerCase();

    if (
      !validVideoTypes.includes(file.mimetype) ||
      !validExtensions.includes(fileExtension)
    ) {
      return cb(
        new Error(
          `Invalid file type. Please upload only ${validVideoTypes.join(
            ", "
          )} files for video.`
        ),
        false
      );
    }
    cb(null, true);
  },
}).single("video");

export { uploadImage, uploadVideo, handleImageUpload, handleVideoUpload };
