import express from "express";

import {
  getExercises,
  getExerciseById
} from "../controllers/exerciseController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getExercises
);

router.get(
  "/:id",
  protect,
  getExerciseById
);

export default router;