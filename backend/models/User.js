import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    passwordHash: {
      type: String,
      required: true
    },

    age: {
      type: Number,
      min: 13,
      max: 100
    },

    height: {
      type: Number,
      min: 50,
      max: 250
    },

    weight: {
      type: Number,
      min: 20,
      max: 300
    },

    gender: {
      type: String,
      enum: [
        "male",
        "female",
        "other"
      ]
    },

    experience: {
      type: String,
      enum: [
        "beginner",
        "intermediate",
        "advanced"
      ]
    },

    activityLevel: {
      type: String,
      enum: [
        "sedentary",
        "light",
        "moderate",
        "very-active"
      ]
    },

    workoutDays: {
      type: Number,
      min: 1,
      max: 7
    },

    equipment: {
      type: String
    },

    physiqueGoal: {
      type: String,
      enum: [
        "lean",
        "bulk",
        "power",
        "toned",
        "athletic",
        "recomp",
        "endurance",
        "bodybuilder",
        "crossfit",
        "calisthenics"
      ],
      default: "lean"
    },

    dietPreference: {
      type: String,
      enum: [
        "vegetarian",
        "non-vegetarian",
        "vegan",
        "eggetarian"
      ]
    }
  },
  {
    timestamps: true
  }
);

const User = mongoose.model(
  "User",
  userSchema
);

export default User;