import mongoose from "mongoose";

const incidentSchema = new mongoose.Schema({
  sessionId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  roomId: {
    type: String,
    required: true,
  },
  cinemaId: {
    type: String,
    required: true,
  },
  incidentDescription: {
    type: String,
    required: true,
  },
  incidentStatus: {
    type: String,
    enum: ["reported", "in progress", "resolved"],
    default: "reported",
  },
  incidentReportedAt: {
    type: Date,
    default: Date.now,
  },
});

const Incident = mongoose.model("Incident", incidentSchema);

export default Incident;
