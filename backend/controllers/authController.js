import bcrypt from "bcryptjs";

import User from "../models/User.js";

import {
  generateToken
} from "../utils/jwt.js";

const register = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      email,
      password
    } = req.body;

    const existingUser =
      await User.findOne({
        email
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "An account with this email already exists"
      });
    }

    const passwordHash =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        email,
        passwordHash
      });

    const token =
      generateToken(user._id);

    res.status(201).json({
      success: true,

      message:
        "Account created successfully",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

const login = async (
  req,
  res,
  next
) => {
  try {
    const {
      email,
      password
    } = req.body;

    const user =
      await User.findOne({
        email
      });

    if (!user) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        user.passwordHash
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password"
      });
    }

    const token =
      generateToken(user._id);

    res.json({
      success: true,

      message:
        "Login successful",

      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

const getCurrentUser = async (
  req,
  res,
  next
) => {
  try {
    const user =
      await User.findById(
        req.userId
      ).select("-passwordHash");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

export {
  register,
  login,
  getCurrentUser
};