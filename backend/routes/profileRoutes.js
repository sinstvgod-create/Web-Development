import express from "express";

import {
  getProfile,
  updateProfile
} from "../controllers/profileController.js";

import protect from "../middleware/authMiddleware.js";

import {
  validateProfile
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.get(
  "/",
  protect,
  getProfile
);

router.put(
  "/",
  protect,
  validateProfile,
  updateProfile
);

export default router;