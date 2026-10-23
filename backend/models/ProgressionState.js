import mongoose from "mongoose";

const progressionStateSchema = new mongoose.Schema(
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

    currentWeight: {
      type: Number,
      required: true,
      min: 0
    },

    targetSets: {
      type: Number,
      required: true,
      min: 1
    },

    targetReps: {
      type: Number,
      required: true,
      min: 1
    },

    failureCount: {
      type: Number,
      default: 0,
      min: 0
    },

    status: {
      type: String,
      enum: [
        "active",
        "progression-ready",
        "deload"
      ],
      default: "active"
    },

    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

const ProgressionState = mongoose.model(
  "ProgressionState",
  progressionStateSchema
);

export default ProgressionState;