import mongoose from "mongoose";

const workoutLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    exerciseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exercise",
      required: true
    },

    date: {
      type: Date,
      default: Date.now
    },

    sets: {
      type: Number,
      required: true,
      min: 1
    },

    reps: {
      type: Number,
      required: true,
      min: 1
    },

    weight: {
      type: Number,
      required: true,
      min: 0
    },

    volume: {
      type: Number,
      default: 0
    },

    result: {
      type: String,
      enum: [
        "success",
        "failure"
      ],
      required: true
    }
  },
  {
    timestamps: true
  }
);

const WorkoutLog = mongoose.model(
  "WorkoutLog",
  workoutLogSchema
);

export default WorkoutLog;