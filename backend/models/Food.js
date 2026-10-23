import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },

    category: {
      type: String,
      required: true,
      trim: true
    },

    dietTypes: [
      {
        type: String,
        enum: [
          "vegetarian",
          "non-vegetarian",
          "vegan",
          "eggetarian"
        ]
      }
    ],

    calories: {
      type: Number,
      required: true,
      min: 0
    },

    protein: {
      type: Number,
      required: true,
      min: 0
    },

    carbs: {
      type: Number,
      required: true,
      min: 0
    },

    fat: {
      type: Number,
      required: true,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

const Food = mongoose.model(
  "Food",
  foodSchema
);

export default Food;