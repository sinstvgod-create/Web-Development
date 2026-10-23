import mongoose from "mongoose";

const dietPlanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    calorieTarget: {
      type: Number,
      required: true,
      min: 0
    },

    proteinTarget: {
      type: Number,
      required: true,
      min: 0
    },

    carbTarget: {
      type: Number,
      required: true,
      min: 0
    },

    fatTarget: {
      type: Number,
      required: true,
      min: 0
    },

    meals: [
      {
        type: {
          type: String,
          required: true
        },

        name: {
          type: String,
          required: true
        },

        foods: [
          {
            name: {
              type: String,
              required: true
            },

            quantity: {
              type: String,
              required: true
            }
          }
        ],

        calories: {
          type: Number,
          default: 0
        },

        protein: {
          type: Number,
          default: 0
        },

        carbs: {
          type: Number,
          default: 0
        },

        fat: {
          type: Number,
          default: 0
        }
      }
    ]
  },
  {
    timestamps: true
  }
);

const DietPlan = mongoose.model(
  "DietPlan",
  dietPlanSchema
);

export default DietPlan;