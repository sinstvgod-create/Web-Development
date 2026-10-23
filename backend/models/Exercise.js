import mongoose from "mongoose";

const exerciseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    muscleGroup: {
      type: String,
      required: true,
      trim: true
    },

    equipment: {
      type: String,
      required: true,
      trim: true
    },

    difficulty: {
      type: String,
      enum: [
        "beginner",
        "intermediate",
        "advanced"
      ],
      default: "beginner"
    },

    goals: [
      {
        type: String,
        enum: [
          "lean",
          "bulk",
          "athletic",
          "toned"
        ]
      }
    ],

    defaultSets: {
      type: Number,
      default: 3
    },

    defaultReps: {
      type: Number,
      default: 10
    },

    progressionType: {
      type: String,
      enum: [
        "weight",
        "reps",
        "weight-and-reps"
      ],
      default: "weight"
    }
  },
  {
    timestamps: true
  }
);

const Exercise = mongoose.model(
  "Exercise",
  exerciseSchema
);

export default Exercise;