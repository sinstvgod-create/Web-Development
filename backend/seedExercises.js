import dotenv from "dotenv";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import Exercise from "./models/Exercise.js";
import exercises from "./data/exercises.js";

dotenv.config();

const seedExercises = async () => {
  try {
    await connectDB();

    await Exercise.deleteMany();

    await Exercise.insertMany(
      exercises
    );

    console.log(
      `${exercises.length} exercises added successfully`
    );

    await mongoose.connection.close();

    process.exit(0);
  } catch (error) {
    console.error(
      "Exercise seeding failed:",
      error.message
    );

    await mongoose.connection.close();

    process.exit(1);
  }
};

seedExercises();