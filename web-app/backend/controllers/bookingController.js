import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import prisma from "../config/prismaClient.js";
import Booking from "../models/bookingModel.js";

// Create or update a booking
const createOrUpdateBooking = asyncHandler(async (req, res) => {
  const {
    bookingId,
    sessionId,
    userId,
    movieId,
    cinemaId,
    roomId,
    seatsBooked,
    bookingPrice,
    bookingStatus = "pending",
    timeRange,
  } = req.body;

  try {
    const sessionIDInt = parseInt(sessionId);
    const userIDInt = parseInt(userId);
    const movieIDInt = parseInt(movieId);
    const roomIDInt = parseInt(roomId);
    const cinemaIDInt = parseInt(cinemaId);
    const timeRangeIDInt = parseInt(timeRange.timeRangeId);

    if (
      isNaN(sessionIDInt) ||
      isNaN(userIDInt) ||
      isNaN(movieIDInt) ||
      isNaN(roomIDInt) ||
      isNaN(cinemaIDInt) ||
      isNaN(timeRangeIDInt)
    ) {
      return res.status(400).json({ message: "Invalid ID format provided." });
    }

    const movie = await prisma.movie.findUnique({ where: { id: movieIDInt } });
    const user = await prisma.user.findUnique({ where: { id: userIDInt } });
    const session = await prisma.session.findUnique({
      where: { id: sessionIDInt },
      include: { timeRanges: true, room: true },
    });
    const room = await prisma.room.findUnique({ where: { id: roomIDInt } });
    const cinema = await prisma.cinema.findUnique({
      where: { id: cinemaIDInt },
    });

    if (!movie || !user || !session || !room || !cinema) {
      return res.status(404).json({ message: "Referenced entity not found." });
    }

    if (!bookingPrice) {
      return res.status(400).json({ message: "Booking price is required." });
    }

    if (!Array.isArray(seatsBooked)) {
      return res
        .status(400)
        .json({ message: "Seats booked must be an array." });
    }

    // Check if seats are already booked for the specific time range
    const existingBookings = await prisma.seatStatus.findMany({
      where: {
        timeRangeId: timeRangeIDInt,
        status: "booked",
      },
      include: {
        seat: true,
      },
    });

    const bookedSeats = existingBookings.map(
      (status) => status.seat.seatNumber
    );

    const validSeats = await Promise.all(
      seatsBooked.map(async (seat) => {
        const seatEntity = await prisma.seat.findFirst({
          where: {
            seatNumber: String(seat.seatNumber),
            roomId: roomIDInt,
          },
        });

        if (!seatEntity) {
          console.error("Seat not found:", seat.seatNumber);
          throw new Error(`Seat not found: ${seat.seatNumber}`);
        }

        if (bookedSeats.includes(seat.seatNumber)) {
          throw new Error(
            `Seat ${seat.seatNumber} is already booked for this time range.`
          );
        }

        await prisma.seatStatus.updateMany({
          where: {
            seatId: seatEntity.id,
            timeRangeId: timeRangeIDInt,
          },
          data: {
            status: seat.status,
          },
        });

        return {
          seatId: seatEntity.id,
          seatNumber: seatEntity.seatNumber,
          status: seat.status,
          pmrSeat: seat.pmrSeat,
        };
      })
    );

    let booking;
    if (bookingId) {
      const existingBooking = await Booking.findById(bookingId);

      if (!existingBooking) {
        return res.status(404).json({ message: "Booking not found." });
      }

      existingBooking.sessionId = sessionId;
      existingBooking.userId = userId;
      existingBooking.movieId = movieId;
      existingBooking.cinemaId = cinemaId;
      existingBooking.roomId = roomId;
      existingBooking.seatsBooked = validSeats;
      existingBooking.bookingPrice = bookingPrice;
      existingBooking.bookingStatus = bookingStatus;
      existingBooking.timeRange = timeRange;

      booking = await existingBooking.save();
    } else {
      booking = await Booking.create({
        sessionId,
        userId,
        movieId,
        roomId,
        cinemaId,
        seatsBooked: validSeats,
        bookingPrice,
        bookingStatus,
        timeRange,
      });
    }

    res.status(201).json({
      message: "Booking created successfully!",
      booking: {
        ...booking._doc,
        timeRange,
      },
    });
  } catch (error) {
    console.error("Error creating/updating booking:", error);
    res.status(500).json({
      message: "Error creating/updating booking due to server issue.",
      error: error.message,
    });
  }
});

const getBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;

  console.log("Received request to get booking with ID:", id);

  if (!id) {
    console.log("Missing booking ID");
    return res.status(400).json({ message: "Missing booking ID" });
  }

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid booking ID:", id);
    return res.status(400).json({ message: "Invalid booking ID" });
  }

  try {
    // Fetch booking from MongoDB using booking ID
    const booking = await Booking.findById(id);

    if (!booking) {
      console.log("Booking not found for ID:", id);
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("Booking found:", booking);

    // Ensure timeRange exists in the booking document
    if (!booking.timeRange || !booking.timeRange.timeRangeId) {
      console.log("No valid time range found in the booking for ID:", id);
      return res
        .status(400)
        .json({ message: "No valid time range found in the booking." });
    }

    // Fetch movie, user, and session details from Prisma
    const [movie, user, session] = await Promise.all([
      prisma.movie.findUnique({
        where: { id: parseInt(booking.movieId, 10) },
        select: {
          movieTitle: true,
          movieImg: true,
        },
      }),
      prisma.user.findUnique({
        where: { id: parseInt(booking.userId, 10) },
        select: {
          id: true,
          userFirstName: true,
          userLastName: true,
          userEmail: true,
        },
      }),
      prisma.session.findUnique({
        where: { id: parseInt(booking.sessionId, 10) },
        include: {
          room: {
            include: {
              cinema: true,
            },
          },
          timeRanges: {
            where: {
              id: booking.timeRange.timeRangeId,
            },
          },
        },
      }),
    ]);

    if (!session) {
      console.log("Session not found for session ID:", booking.sessionId);
      return res.status(404).json({ message: "Session not found" });
    }

    const selectedTimeRange = session.timeRanges[0];

    console.log("Selected time range:", selectedTimeRange);

    // Construct the response
    const formattedBooking = {
      id: booking._id,

      movie: {
        movieId: booking.movieId,
        movieTitle: movie ? movie.movieTitle : null,
        movieImg: movie ? movie.movieImg : null,
      },
      seatsBooked: booking.seatsBooked.map((seat) => ({
        seatNumber: seat.seatNumber,
        status: seat.status,
        pmrSeat: seat.pmrSeat,
      })),
      bookingPrice: booking.bookingPrice,
      bookingStatus: booking.bookingStatus,
      bookingCreatedAt: booking.bookingCreatedAt,
      session: {
        id: session.id,
        sessionPrice: session.sessionPrice,
        cinema: {
          id: session.room.cinema.id,
          cinemaName: session.room.cinema.cinemaName,
          room: {
            id: session.room.id,
            roomNumber: session.room.roomNumber,
            roomQuality: session.room.roomQuality,
          },
        },
        timeRange: selectedTimeRange
          ? {
              timeRangeId: selectedTimeRange.id,
              timeRangeStartTime: selectedTimeRange.timeRangeStartTime,
              timeRangeEndTime: selectedTimeRange.timeRangeEndTime,
            }
          : null,
      },
      user: {
        userId: user.id,
        userFirstName: user.userFirstName,
        userLastName: user.userLastName,
        userEmail: user.userEmail,
      },
    };

    res.status(200).json(formattedBooking);
  } catch (error) {
    console.error("Error retrieving booking:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const getBookingsCountLast7Days = asyncHandler(async (req, res) => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  // Query MongoDB for bookings in the last 7 days
  const bookings = await Booking.find({
    bookingCreatedAt: { $gte: sevenDaysAgo },
  }).populate("cinemaId"); // Assuming cinemaId is the field for the cinema in Booking

  // Count bookings by movieId and gather required details
  let bookingDetails = {};
  bookings.forEach((booking) => {
    const movieId = booking.movieId.toString();
    if (!bookingDetails[movieId]) {
      bookingDetails[movieId] = {
        bookingIds: [],
        movieId: movieId,
        cinemaName: booking.cinemaId.cinemaName, // Assuming cinemaId is populated
        count: 0,
      };
    }
    bookingDetails[movieId].bookingIds.push(booking._id);
    bookingDetails[movieId].count += 1;
  });

  // Query Prisma for movie titles using the movie IDs as integers
  const movieIds = Object.keys(bookingDetails).map((id) => parseInt(id));
  const movies = await prisma.movie.findMany({
    where: {
      id: { in: movieIds },
    },
    select: {
      id: true,
      movieTitle: true,
    },
  });

  // Map booking details to movie titles
  let bookingDetailsByTitle = movies.map((movie) => ({
    ...bookingDetails[movie.id.toString()],
    movieTitle: movie.movieTitle,
  }));

  res.status(200).json(bookingDetailsByTitle);
});

// Reset booking counts
const resetBookingCounts = asyncHandler(async (req, res) => {
  await Booking.deleteMany({});

  res.status(200).json({ message: "Booking counts reset successfully" });
});

// Update a booking
const updateBooking = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { seatsBooked, bookingPrice, bookingStatus } = req.body;

  // Validate the MongoDB ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid booking ID format." });
  }

  const booking = await Booking.findById(id);

  if (!booking) {
    return res.status(404).json({ message: "Booking not found." });
  }

  // Updating the specific fields
  if (seatsBooked) {
    booking.seatsBooked = seatsBooked.map((seat) => ({
      seatNumber: seat.seatNumber,
      status: seat.status || "booked", // Defaulting the status to 'booked' if not provided
      pmrSeat: seat.pmrSeat || false, // Defaulting PMR (Persons with Reduced Mobility) to false if not provided
    }));
  }

  if (bookingPrice !== undefined) {
    booking.bookingPrice = bookingPrice;
  }

  if (bookingStatus) {
    booking.bookingStatus = bookingStatus;
  }

  try {
    const updatedBooking = await booking.save();
    const formattedBooking = {
      id: updatedBooking._id,
      sessionId: updatedBooking.sessionId,
      userId: updatedBooking.userId,
      movieId: updatedBooking.movieId,
      seatsBooked: updatedBooking.seatsBooked.map((seat) => ({
        seatNumber: seat.seatNumber,
        status: seat.status,
        pmrSeat: seat.pmrSeat,
      })),
      bookingPrice: updatedBooking.bookingPrice,
      bookingStatus: updatedBooking.bookingStatus,
      bookingCreatedAt: updatedBooking.bookingCreatedAt,
    };
    res.status(200).json(formattedBooking);
  } catch (error) {
    console.error("Error updating booking:", error);
    res.status(500).json({
      message: "Server error during booking update",
      error: error.message,
    });
  }
});

// Delete a booking
const deleteBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Find the booking to get the seatsBooked
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the seat statuses to available in MySQL
    const updateSeats = booking.seatsBooked.map((seat) =>
      prisma.seatStatus.updateMany({
        where: {
          seatId: seat.seatId,
          timeRangeId: booking.timeRange.timeRangeId,
        },
        data: {
          status: "available",
        },
      })
    );

    await Promise.all(updateSeats);

    // Delete the booking from MongoDB
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Booking successfully removed" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      message: "Error removing booking",
      error: error.message,
    });
  }
});

const softDeleteBooking = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;

  try {
    // Find the booking to get the seatsBooked
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Update the seat statuses to available in MySQL
    const updateSeats = booking.seatsBooked.map((seat) =>
      prisma.seatStatus.updateMany({
        where: {
          seatId: seat.seatId,
          timeRangeId: booking.timeRange.timeRangeId,
        },
        data: {
          status: "available",
        },
      })
    );

    await Promise.all(updateSeats);

    // Soft delete the booking in MongoDB
    booking.isDeleted = true;
    booking.bookingStatus = "cancelled";
    await booking.save();

    res.status(200).json({ message: "Booking successfully removed" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({
      message: "Error removing booking",
      error: error.message,
    });
  }
});

// Get all bookings
const getBookings = asyncHandler(async (req, res) => {
  try {
    const bookings = await Booking.find({}); // Fetch bookings using Mongoose

    // If no bookings found, return an empty array immediately
    if (!bookings.length) {
      return res.status(200).json([]);
    }

    // Fetch related data for each booking asynchronously
    const formattedBookings = await Promise.all(
      bookings.map(async (booking) => {
        const session = await prisma.session.findUnique({
          where: { id: parseInt(booking.sessionId, 10) },
          include: {
            room: {
              include: {
                cinema: true,
              },
            },
            movie: true,
            timeRanges: true,
          },
        });
        const user = await prisma.user.findUnique({
          where: { id: parseInt(booking.userId, 10) },
        });
        const movie = await prisma.movie.findUnique({
          where: { id: parseInt(booking.movieId, 10) },
        });

        const formattedSession = session
          ? {
              id: session.id,
              sessionPrice: session.sessionPrice,
              room: {
                id: session.room.id,
                roomNumber: session.room.roomNumber,
                cinema: {
                  id: session.room.cinema.id,
                  cinemaName: session.room.cinema.cinemaName,
                },
              },
              movie: {
                id: session.movie.id,
                movieTitle: session.movie.movieTitle,
                movieImg: session.movie.movieImg,
              },
              timeRanges: session.timeRanges.map((timeRange) => ({
                timeRangeId: timeRange.id,
                timeRangeStartTime: timeRange.timeRangeStartTime,
                timeRangeEndTime: timeRange.timeRangeEndTime,
              })),
            }
          : "Session not found";

        return {
          _id: booking._id.toString(),
          sessionId: booking.sessionId,
          userId: booking.userId,
          movieId: booking.movieId,
          seatsBooked: booking.seatsBooked.map((seat) => ({
            seatNumber: seat.seatNumber,
            status: seat.status,
            pmrSeat: seat.pmrSeat,
          })),
          bookingPrice: booking.bookingPrice,
          bookingStatus: booking.bookingStatus,
          bookingCreatedAt: booking.bookingCreatedAt,
          session: formattedSession,
          user: user
            ? {
                id: user.id,
                userFirstName: user.userFirstName,
                userLastName: user.userLastName,
                userEmail: user.userEmail,
              }
            : "User not found",
          movie: movie
            ? {
                id: movie.id,
                movieTitle: movie.movieTitle,
                movieImg: movie.movieImg,
              }
            : "Movie not found",
        };
      })
    );

    res.status(200).json(formattedBookings);
  } catch (error) {
    console.error("Error retrieving bookings:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export {
  createOrUpdateBooking,
  getBooking,
  getBookingsCountLast7Days,
  updateBooking,
  softDeleteBooking,
  deleteBooking,
  getBookings,
  resetBookingCounts,
};
