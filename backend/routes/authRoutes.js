import express from "express";

import {
  register,
  login,
  getCurrentUser
} from "../controllers/authController.js";

import protect from "../middleware/authMiddleware.js";

import {
  validateRegistration,
  validateLogin
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/register",
  validateRegistration,
  register
);

router.post(
  "/login",
  validateLogin,
  login
);

router.get(
  "/me",
  protect,
  getCurrentUser
);

export default router;