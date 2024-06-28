import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import mysql from "mysql2/promise";
import mongoose from "mongoose";
import http from "http";
import Stripe from "stripe";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

import bookingRoutes from "./routes/bookingRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cinemaRoutes from "./routes/cinemaRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import movieRoutes from "./routes/movieRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import seatRoutes from "./routes/seatRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import userRoutes from "./routes/userRoutes.js";

// Initialize Stripe
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
console.log(`Stripe Initialized ✅`);

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let mysqlConnection;
let mysqlPool;

// Function to connect to MySQL
const connectMySQL = async () => {
  try {
    const host = process.env.MYSQL_HOST;
    const user = process.env.MYSQL_USER;
    const password = process.env.MYSQL_PASSWORD;
    const port = process.env.MYSQL_PORT || 3306;

    mysqlPool = mysql.createPool({
      host,
      user,
      password,
      port,
      connectTimeout: 60000,
    });

    mysqlConnection = await mysqlPool.getConnection();
    console.log(`MySQL Connected: ${host} ✅`);

    return {
      connection: mysqlConnection,
      pool: mysqlPool,
      host,
      user,
      port,
      password,
    };
  } catch (error) {
    console.error(`Error from MySQL: ${error.message}`);
    console.error(`Stack Trace: ${error.stack}`);
    throw error;
  }
};

// Function to connect to MongoDB using Mongoose
const connectMongoDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 30000,
    });
    console.log(`MongoDB Connected ✅`);
  } catch (error) {
    console.error(`Error from MongoDB: ${error.message}`);
    console.error(`Stack Trace: ${error.stack}`);
    throw error;
  }
};

const app = express();
const port = process.env.PORT;

// CORS and other middleware configurations
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Connect to MySQL and MongoDB
(async () => {
  try {
    await connectMySQL();
    await connectMongoDB();

    // Routes
    app.use("/api/bookings", bookingRoutes);
    app.use("/api/categories", categoryRoutes);
    app.use("/api/cinemas", cinemaRoutes);
    app.use("/api/incidents", incidentRoutes);
    app.use("/api/movies", movieRoutes);
    app.use("/api/rooms", roomRoutes);
    app.use("/api/seats", seatRoutes);
    app.use("/api/sessions", sessionRoutes);
    app.use("/api/uploads", uploadRoutes);
    app.use("/api/users", userRoutes);

    // Add Stripe payment route
    app.post("/create-payment-intent", async (req, res) => {
      const { amount } = req.body;
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency: "eur",
        });

        res.send({
          clientSecret: paymentIntent.client_secret,
        });
      } catch (e) {
        res.status(400).send({
          error: {
            message: e.message,
          },
        });
      }
    });

    // Add a route handler for the root ("/") path
    app.get("/", (req, res) => {
      res.status(200).send("Server is running 🚀");
    });

    // Handling static files
    app.use("/api/uploads", express.static(path.join(__dirname, "uploads")));

    const server = http.createServer(app);
    server.listen(port, () => console.log(`Server running on port ${port} ✅`));
    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${port} is already in use`);
      } else {
        throw err;
      }
    });

    // Handle SIGINT to gracefully shutdown
    process.on("SIGINT", async () => {
      console.log("\nGracefully shutting down...");
      try {
        if (mysqlConnection) await mysqlConnection.release();
        if (mysqlPool) await mysqlPool.end();
        if (mongoose.connection) await mongoose.connection.close();
        console.log("Connections closed successfully. Exiting...");
        process.exit(0);
      } catch (error) {
        console.error("Error during shutdown:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error("Failed to initialize the server:", error);
    process.exit(1);
  }
})();

export { app, connectMySQL, connectMongoDB, port };
