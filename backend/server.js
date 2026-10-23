import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import planRoutes from "./routes/planRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import progressRoutes from "./routes/progressRoutes.js";

import errorMiddleware from "./middleware/errorMiddleware.js";

dotenv.config();

const app = express();

const PORT =
  process.env.PORT || 5000;

connectDB();

// Updated CORS configuration to allow local development and any deployed frontend
app.use(
  cors({
    origin: ["http://localhost:5173", "*"], // Allows local dev and public origins
    credentials: true
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message:
      "OverloadFit API is running",
    status: "success"
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/profile",
  profileRoutes
);

app.use(
  "/api/plan",
  planRoutes
);

app.use(
  "/api/workouts",
  workoutRoutes
);

app.use(
  "/api/exercises",
  exerciseRoutes
);

app.use(
  "/api/progress",
  progressRoutes
);

app.use(errorMiddleware);

app.listen(
  PORT,
  () => {
    console.log(
      `OverloadFit backend running on http://localhost:${PORT}`
    );
  }
);