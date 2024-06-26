import asyncHandler from "express-async-handler";
import Incident from "../models/incidentModel.js";

// Create a new incident
const createIncident = asyncHandler(async (req, res) => {
  const {
    sessionId,
    userId,
    roomId,
    cinemaId,
    incidentDescription,
    incidentStatus,
  } = req.body;

  // Convert IDs for SQL database operations
  const sessionIDInt = parseInt(sessionId);
  const userIDInt = parseInt(userId);
  const roomIDInt = parseInt(roomId);
  const cinemaIDInt = parseInt(cinemaId);

  // Validate IDs
  if (
    isNaN(sessionIDInt) ||
    isNaN(userIDInt) ||
    isNaN(roomIDInt) ||
    isNaN(cinemaIDInt)
  ) {
    return res.status(400).json({ message: "Invalid ID format provided." });
  }

  // Validate existence of references in SQL database using Prisma
  const session = await prisma.session.findUnique({
    where: { id: sessionIDInt },
  });

  const user = await prisma.user.findUnique({
    where: { id: userIDInt },
  });

  const room = await prisma.room.findUnique({
    where: { id: roomIDInt },
  });

  const cinema = await prisma.cinema.findUnique({
    where: { id: cinemaIDInt },
  });

  if (!session) {
    return res.status(404).json({ message: "Session not found." });
  }

  if (!user) {
    return res.status(404).json({ message: "User not found." });
  }

  if (!room) {
    return res.status(404).json({ message: "Room not found." });
  }

  if (!cinema) {
    return res.status(404).json({ message: "Cinema not found." });
  }

  // Check if an incident with the same session, user, and room already exists
  const existingIncident = await Incident.findOne({
    sessionId: sessionId.toString(),
    userId: userId.toString(),
    roomId: roomId.toString(),
    cinemaId: cinemaId.toString(),
  });

  if (existingIncident) {
    return res.status(409).json({
      message: "Incident already reported for this session, user, and room.",
    });
  }

  try {
    // Create new incident in MongoDB without converting IDs to ObjectId
    const newIncident = await Incident.create({
      sessionId: sessionId.toString(),
      userId: userId.toString(),
      roomId: roomId.toString(),
      cinemaId: cinemaId.toString(),
      incidentDescription,
      incidentStatus,
      incidentReportedAt: new Date(),
    });

    res.status(201).json({
      message: "Incident reported successfully!",
      incident: newIncident,
    });
  } catch (error) {
    console.error("Error reporting incident:", error);
    res.status(500).json({
      message: "Error creating incident due to server issue.",
      error: error.message,
    });
  }
});

const getIncidents = asyncHandler(async (req, res) => {
  try {
    const incidents = await Incident.find({});

    // If no incidents found, return an empty array immediately
    if (!incidents.length) {
      return res.status(200).json([]);
    }

    // Fetch related data for each incident asynchronously
    const formattedIncidents = await Promise.all(
      incidents.map(async (incident) => {
        const sessionId = incident.sessionId
          ? parseInt(incident.sessionId)
          : null;
        const userId = incident.userId ? parseInt(incident.userId) : null;
        const roomId = incident.roomId ? parseInt(incident.roomId) : null;

        const session =
          sessionId !== null
            ? await prisma.session.findUnique({ where: { id: sessionId } })
            : null;

        const user =
          userId !== null
            ? await prisma.user.findUnique({
                where: { id: userId },
                select: {
                  // Select specific fields from the user model
                  id: true,
                  userFirstName: true,
                  userLastName: true,
                  userEmail: true,
                },
              })
            : null;

        const room =
          roomId !== null
            ? await prisma.room.findUnique({
                where: { id: roomId },
                select: {
                  // Select specific fields from the room model
                  id: true,
                  roomNumber: true,
                },
              })
            : null;

        return {
          _id: incident._id,
          sessionId: session ? session.id.toString() : "Session not found",
          userId: user ? user.id.toString() : "User not found",
          userFirstName: user ? user.userFirstName : "User not found",
          userLastName: user ? user.userLastName : "User not found",
          userEmail: user ? user.userEmail : "User not found",
          roomId: room ? room.id.toString() : "Room not found",
          roomNumber: room ? room.roomNumber : "Room not found",
          incidentDescription: incident.incidentDescription,
          incidentStatus: incident.incidentStatus,
          incidentReportedAt: incident.incidentReportedAt,
        };
      })
    );

    res.status(200).json(formattedIncidents);
  } catch (error) {
    console.error("Error retrieving incidents:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const getIncident = asyncHandler(async (req, res) => {
  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    const sessionId = incident.sessionId ? parseInt(incident.sessionId) : null;
    const userId = incident.userId ? parseInt(incident.userId) : null;
    const roomId = incident.roomId ? parseInt(incident.roomId) : null;
    const cinemaId = incident.cinemaId ? parseInt(incident.cinemaId) : null;

    const session =
      sessionId !== null
        ? await prisma.session.findUnique({ where: { id: sessionId } })
        : null;

    const user =
      userId !== null
        ? await prisma.user.findUnique({
            where: { id: userId },
            select: {
              id: true,
              userFirstName: true,
              userLastName: true,
              userEmail: true,
            },
          })
        : null;

    const room =
      roomId !== null
        ? await prisma.room.findUnique({
            where: { id: roomId },
            select: {
              id: true,
              roomNumber: true,
            },
          })
        : null;

    const cinema =
      cinemaId !== null
        ? await prisma.cinema.findUnique({
            where: { id: cinemaId },
            select: {
              id: true,
              cinemaName: true,
              cinemaAddress: true,
              cinemaPostalCode: true,
              cinemaCity: true,
              cinemaCountry: true,
              cinemaStartTimeOpening: true,
              cinemaEndTimeOpening: true,
            },
          })
        : null;

    const formattedIncident = {
      _id: incident._id,
      sessionId: session ? session.id.toString() : "Session not found",

      userId: user ? user.id.toString() : "User not found",
      userFirstName: user ? user.userFirstName : "User not found",
      userLastName: user ? user.userLastName : "User not found",
      userEmail: user ? user.userEmail : "User not found",

      roomId: room ? room.id.toString() : "Room not found",
      roomNumber: room ? room.roomNumber : "Room not found",

      cinemaId: cinema ? cinema.id.toString() : "Cinema not found",
      cinemaName: cinema ? cinema.cinemaName : "Cinema not found",
      cinemaAddress: cinema ? cinema.cinemaAddress : "Cinema not found",
      cinemaPostalCode: cinema ? cinema.cinemaPostalCode : "Cinema not found",
      cinemaCity: cinema ? cinema.cinemaCity : "Cinema not found",
      cinemaCountry: cinema ? cinema.cinemaCountry : "Cinema not found ",
      cinemaStartTimeOpening: cinema
        ? cinema.cinemaStartTimeOpening
        : "Cinema not found",
      cinemaEndTimeOpening: cinema
        ? cinema.cinemaEndTimeOpening
        : "Cinema not found",

      incidentDescription: incident.incidentDescription,
      incidentStatus: incident.incidentStatus,
      incidentReportedAt: incident.incidentReportedAt,
    };

    res.json(formattedIncident);
  } catch (error) {
    console.error("Failed to fetch incident:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const updateIncident = asyncHandler(async (req, res) => {
  const { incidentStatus } = req.body; // Destructure the status from the request body

  try {
    const incident = await Incident.findById(req.params.id);
    if (!incident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    // Update the status if a new status is provided
    if (incidentStatus) {
      incident.incidentStatus = incidentStatus;
      const updatedIncident = await incident.save();
      res.json(updatedIncident);
    } else {
      res.status(400).json({ message: "No status update provided" });
    }
  } catch (error) {
    console.error("Error updating incident:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

const deleteIncident = asyncHandler(async (req, res) => {
  const incidentId = req.params.id;

  try {
    // This method will attempt to find and delete the document in one step.
    const deletedIncident = await Incident.findByIdAndDelete(incidentId);

    if (!deletedIncident) {
      return res.status(404).json({ message: "Incident not found" });
    }

    res.status(204).json({ message: "Incident deleted successfully" });
  } catch (error) {
    console.error("Error deleting incident:", error);
    res.status(500).json({
      message: "Error deleting incident due to server issue.",
      error: error.message,
    });
  }
});

export {
  createIncident,
  getIncidents,
  getIncident,
  updateIncident,
  deleteIncident,
};
