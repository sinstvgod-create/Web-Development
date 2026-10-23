import express from "express";

import {
  generatePlan,
  getWorkoutPlan,
  getDietPlan,
  getNextTarget
} from "../controllers/planController.js";

import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/generate",
  protect,
  generatePlan
);

router.get(
  "/workout",
  protect,
  getWorkoutPlan
);

router.get(
  "/diet",
  protect,
  getDietPlan
);

router.get(
  "/next",
  protect,
  getNextTarget
);

export default router;