import express from "express";
import {
  createIncident,
  getIncidents,
  getIncident,
  updateIncident,
  deleteIncident,
} from "../controllers/incidentController.js";
import {
  authenticatedUser,
  authorizedAdmin,
} from "../middlewares/authMiddleware.js"; // Adjust the import path as necessary

const router = express.Router();

// POST /api/incidents - Create a new incident
// Assuming only administrators or specific roles can create incidents
router.post("/", authenticatedUser, authorizedAdmin, createIncident);

// GET /api/incidents - List all incidents
// This might be open to all authenticated users or further restricted based on your requirements
router.get("/", authenticatedUser, getIncidents);

// GET /api/incidents/:id - Get a specific incident by ID
// This might be open to all authenticated users or further restricted based on your requirements
router.get("/:id", authenticatedUser, getIncident);

// PUT /api/incidents/:id - Update a specific incident by ID
// Assuming only administrators or specific roles can update incidents
router.put("/:id", authenticatedUser, authorizedAdmin, updateIncident);

// DELETE /api/incidents/:id - Delete a specific incident by ID
// Assuming only administrators can delete incidents
router.delete("/:id", authenticatedUser, authorizedAdmin, deleteIncident);

export default router;
