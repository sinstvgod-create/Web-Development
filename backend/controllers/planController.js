import User from "../models/User.js";
import Exercise from "../models/Exercise.js";

import generateWorkoutPlan from "../services/planGenerator.js";
import { generateWorkoutSession } from "../services/workoutGenerator.js";
import generateDietPlan from "../services/dietGenerator.js";

import ProgressionState from "../models/ProgressionState.js";

const generatePlan = async (
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

    const profile = {
      age: user.age,
      height: user.height,
      weight: user.weight,
      gender: user.gender,
      experience: user.experience,
      activityLevel:
        user.activityLevel,
      workoutDays:
        user.workoutDays,
      equipment:
        user.equipment,
      physiqueGoal:
        user.physiqueGoal,
      dietPreference:
        user.dietPreference
    };

    const workoutPlan =
      generateWorkoutPlan(
        profile
      );

    const dietPlan =
      generateDietPlan(
        profile
      );

    const workoutSessions =
      workoutPlan.plan.map(
        (day) =>
          generateWorkoutSession(
            day,
            profile
          )
      );

    /*
      Create progression states
      for the user's exercises.
    */

    for (const day of workoutSessions) {
      for (const exercise of day.exercises) {

        const exerciseDocument =
          await Exercise.findOne({
            name: exercise.name
          });

        if (!exerciseDocument) {
          continue;
        }

        const existingProgression =
          await ProgressionState.findOne({
            userId: req.userId,
            exerciseId:
              exerciseDocument._id
          });

        if (!existingProgression) {
          await ProgressionState.create({
            userId: req.userId,
            exerciseId:
              exerciseDocument._id,
            currentWeight:
              exercise.weight || 0,
            targetSets:
              exercise.sets,
            targetReps:
              exercise.reps,
            failureCount: 0,
            status: "active",
            lastUpdated: new Date()
          });
        }
      }
    }

    res.json({
      success: true,

      message:
        "Personalized plan generated successfully",

      workoutPlan: {
        ...workoutPlan,
        plan: workoutSessions
      },

      dietPlan
    });
  } catch (error) {
    next(error);
  }
};

const getWorkoutPlan = async (
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

    const profile = {
      age: user.age,
      height: user.height,
      weight: user.weight,
      gender: user.gender,
      experience: user.experience,
      activityLevel:
        user.activityLevel,
      workoutDays:
        user.workoutDays,
      equipment:
        user.equipment,
      physiqueGoal:
        user.physiqueGoal,
      dietPreference:
        user.dietPreference
    };

    const workoutPlan =
      generateWorkoutPlan(
        profile
      );

    const workoutSessions =
      workoutPlan.plan.map(
        (day) =>
          generateWorkoutSession(
            day,
            profile
          )
      );

    res.json({
      success: true,

      workoutPlan: {
        ...workoutPlan,
        plan: workoutSessions
      }
    });
  } catch (error) {
    next(error);
  }
};

const getDietPlan = async (
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

    const profile = {
      age: user.age,
      height: user.height,
      weight: user.weight,
      gender: user.gender,
      experience: user.experience,
      activityLevel:
        user.activityLevel,
      workoutDays:
        user.workoutDays,
      equipment:
        user.equipment,
      physiqueGoal:
        user.physiqueGoal,
      dietPreference:
        user.dietPreference
    };

    const dietPlan =
      generateDietPlan(
        profile
      );

    res.json({
      success: true,
      dietPlan
    });
  } catch (error) {
    next(error);
  }
};

const getNextTarget = async (
  req,
  res,
  next
) => {
  try {
    const progression =
      await ProgressionState.findOne({
        userId: req.userId
      })
        .populate(
          "exerciseId",
          "name muscleGroup equipment"
        )
        .sort({
          lastUpdated: -1
        });

    if (!progression) {
      return res.json({
        success: true,
        nextTarget: null,
        message:
          "No progression target available yet"
      });
    }

    res.json({
      success: true,
      nextTarget: progression
    });
  } catch (error) {
    next(error);
  }
};

export {
  generatePlan,
  getWorkoutPlan,
  getDietPlan,
  getNextTarget
};