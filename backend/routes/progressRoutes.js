import express from "express";

import {
  getProgress,
  getExerciseProgress
} from "../controllers/progressController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getProgress
);

router.get(
  "/:exerciseId",
  protect,
  getExerciseProgress
);

export default router;