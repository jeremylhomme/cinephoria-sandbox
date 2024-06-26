import { PrismaClient } from "@prisma/client";
import asyncHandler from "express-async-handler";
import moment from "moment";
import { join } from "path";

const prisma = new PrismaClient();

const createMovie = asyncHandler(async (req, res) => {
  const {
    movieTitle,
    movieDescription,
    movieReleaseDate,
    movieTrailerUrl,
    movieLength,
    moviePublishingState,
    movieFavorite = false,
    movieMinimumAge,
    categoryIds,
    moviePremiereDate,
    movieScheduleDate, // Add movieScheduleDate here
  } = req.body;

  const movieImg =
    req.body.movieImg ||
    (req.file?.path.includes("images")
      ? join(process.cwd(), req.file.path)
      : undefined);

  if (
    !movieTitle ||
    !movieDescription ||
    !movieReleaseDate ||
    isNaN(parseInt(movieLength)) ||
    !moviePublishingState ||
    isNaN(parseInt(movieMinimumAge)) ||
    !categoryIds ||
    !Array.isArray(categoryIds)
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields." });
  }

  // Check if the movie already exists
  const existingMovie = await prisma.movie.findUnique({
    where: { movieTitle },
  });
  if (existingMovie) {
    return res.status(400).json({ message: "Movie already exists" });
  }

  // Validate category IDs
  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds } },
  });
  if (categories.length !== categoryIds.length) {
    const missingIds = categoryIds.filter(
      (id) => !categories.some((cat) => cat.id === id)
    );
    return res.status(400).json({
      message:
        "One or more Category IDs do not exist: " + missingIds.join(", "),
    });
  }

  try {
    const movieData = {
      movieTitle,
      movieDescription,
      movieReleaseDate: new Date(movieReleaseDate).toISOString(),
      movieLength: parseInt(movieLength, 10),
      movieTrailerUrl,
      movieFavorite,
      moviePublishingState,
      movieMinimumAge: parseInt(movieMinimumAge, 10),
      movieImg,
      categories: {
        connect: categoryIds.map((id) => ({ id })),
      },
    };

    if (moviePremiereDate) {
      movieData.moviePremiereDate = new Date(moviePremiereDate).toISOString();
    }

    if (movieScheduleDate) {
      movieData.movieScheduleDate = new Date(movieScheduleDate).toISOString();
    }

    const movie = await prisma.movie.create({
      data: movieData,
    });

    res.status(201).json(movie);
  } catch (error) {
    console.error("Error creating movie:", error);
    res
      .status(500)
      .json({ message: "Error creating movie", error: error.message });
  }
});

const getMovies = asyncHandler(async (req, res) => {
  const { state, categories, cinemaId } = req.query;

  // State filter
  let stateFilter = {};
  if (state && state !== "all") {
    stateFilter = { moviePublishingState: state };
  }

  // Category filter
  let categoryFilter = {};
  if (categories && categories !== "all") {
    const categoryArray = categories.split(",");
    categoryFilter = {
      categories: {
        some: {
          categoryName: { in: categoryArray },
        },
      },
    };
  }

  // Cinema filter
  let cinemaFilter = {};
  if (cinemaId) {
    cinemaFilter = {
      sessions: {
        some: {
          cinemaId: parseInt(cinemaId),
        },
      },
    };
  }

  // Fetch movies from the database
  const movies = await prisma.movie.findMany({
    where: {
      ...stateFilter,
      ...categoryFilter,
      ...cinemaFilter,
    },
    select: {
      id: true,
      movieTitle: true,
      movieDescription: true,
      movieLength: true,
      movieImg: true,
      moviePublishingState: true,
      movieReleaseDate: true,
      movieMinimumAge: true,
      movieScheduleDate: true,
      moviePremiereDate: true,
      movieTrailerUrl: true,
      movieFavorite: true,
      categories: {
        select: {
          id: true,
          categoryName: true,
        },
      },
      sessions: {
        select: {
          id: true,
          timeRanges: true,
          cinema: {
            select: {
              id: true,
              cinemaName: true,
            },
          },
          room: {
            select: {
              id: true,
              roomCapacity: true,
            },
          },
        },
        take: 1,
      },
    },
  });

  if (cinemaId) {
    const cinema = await prisma.cinema.findUnique({
      where: { id: parseInt(cinemaId) },
      select: {
        cinemaName: true,
      },
    });

    if (!cinema) {
      return res.status(404).json({ message: "Cinema not found" });
    }

    return res.status(200).json({ cinemaName: cinema.cinemaName, movies });
  }

  res.status(200).json(movies);
});

const getMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const movie = await prisma.movie.findUnique({
    where: { id: parseInt(id) },
    select: {
      id: true,
      movieTitle: true,
      movieDescription: true,
      movieLength: true,
      movieImg: true,
      movieFavorite: true,
      moviePublishingState: true,
      movieReleaseDate: true,
      movieMinimumAge: true,
      movieScheduleDate: true,
      moviePremiereDate: true,
      movieTrailerUrl: true,
      categories: {
        select: {
          id: true,
          categoryName: true,
        },
      },
      sessions: {
        select: {
          id: true,
          timeRanges: true,
          cinema: {
            select: {
              id: true,
              cinemaName: true,
            },
          },
          room: {
            select: {
              id: true,
              roomCapacity: true,
            },
          },
        },
      },
    },
  });

  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  res.status(200).json(movie);
});

const updateMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const {
    movieTitle,
    movieDescription,
    movieTrailerUrl,
    movieMinimumAge,
    movieFavorite,
    categoryIds,
    movieReleaseDate,
    movieLength,
    moviePublishingState,
  } = req.body;

  // Handling file paths if included in the request
  const movieImg =
    req.body.movieImg ||
    (req.file?.path.includes("images")
      ? join(process.cwd(), req.file.path)
      : undefined);

  const parsedMinimumAge = parseInt(movieMinimumAge, 10);
  if (isNaN(parsedMinimumAge)) {
    return res.status(400).json({ message: "Invalid minimum age provided" });
  }

  const formattedDate = moment(movieReleaseDate).toISOString(); // Format the date to ISO string using moment

  const movie = await prisma.movie.findUnique({
    where: { id: parseInt(id) },
  });
  if (!movie) {
    return res.status(404).json({ message: "Movie not found" });
  }

  const categories = await prisma.category.findMany({
    where: { id: { in: categoryIds.map((id) => parseInt(id)) } },
  });
  if (categories.length !== categoryIds.length) {
    return res
      .status(400)
      .json({ message: "One or more Category IDs do not exist" });
  }

  // Updating movie with new data
  const updatedMovie = await prisma.movie.update({
    where: { id: parseInt(id) },
    data: {
      movieTitle,
      movieDescription,
      movieReleaseDate: formattedDate,
      movieLength,
      movieTrailerUrl,
      movieImg,
      moviePublishingState,
      movieMinimumAge: parsedMinimumAge,
      movieFavorite,
      categories: {
        set: categoryIds.map((id) => ({ id: parseInt(id) })),
      },
    },
  });

  res.status(200).json({
    ...updatedMovie,
    movieImg: movieImg ? `http://${req.headers.host}/${movieImg}` : null,
  });
});

const deleteMovie = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const movie = await prisma.movie.delete({ where: { id: Number(id) } });
  res.status(200).json({ message: "Movie deleted successfully" });
});

export { createMovie, getMovies, getMovie, updateMovie, deleteMovie };
