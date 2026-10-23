import express from "express";

import {
  logWorkout,
  getWorkoutHistory,
  getTodayWorkout
} from "../controllers/workoutController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/log",
  protect,
  logWorkout
);

router.get(
  "/history",
  protect,
  getWorkoutHistory
);

router.get(
  "/today",
  protect,
  getTodayWorkout
);

export default router;