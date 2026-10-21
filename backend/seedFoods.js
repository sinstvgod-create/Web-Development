import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Food from "./models/Food.js";
import foods from "./data/foods.js";

dotenv.config();

const seedFoods = async () => {
  try {
    await connectDB();

    await Food.deleteMany();

    await Food.insertMany(
      foods
    );

    console.log(
      `${foods.length} foods added successfully`
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "Food seeding failed:",
      error.message
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedFoods();