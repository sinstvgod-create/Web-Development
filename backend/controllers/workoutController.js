import WorkoutLog from "../models/WorkoutLog.js";
import ProgressionState from "../models/ProgressionState.js";
import Exercise from "../models/Exercise.js";

import {
  calculateVolume,
  processProgression
} from "../services/progressionEngine.js";

const logWorkout = async (
  req,
  res,
  next
) => {
  try {
    const {
      exerciseId,
      sets,
      reps,
      weight
    } = req.body;

    if (
      !exerciseId ||
      !sets ||
      !reps ||
      weight === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Exercise, sets, reps and weight are required"
      });
    }

    const exercise =
      await Exercise.findById(
        exerciseId
      );

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message:
          "Exercise not found"
      });
    }

    let progression =
      await ProgressionState.findOne({
        userId: req.userId,
        exerciseId
      });

    if (!progression) {
      progression =
        await ProgressionState.create({
          userId: req.userId,
          exerciseId,
          currentWeight: weight,
          targetSets: sets,
          targetReps: reps
        });
    }

    const progressionResult =
      processProgression({
        currentWeight:
          progression.currentWeight,

        targetSets:
          progression.targetSets,

        targetReps:
          progression.targetReps,

        actualSets: sets,

        actualReps: reps,

        failureCount:
          progression.failureCount,

        progressionType:
          exercise.progressionType
      });

    const volume =
      calculateVolume(
        sets,
        reps,
        weight
      );

    const workoutLog =
      await WorkoutLog.create({
        userId: req.userId,
        exerciseId,
        sets,
        reps,
        weight,
        volume,
        result:
          progressionResult.result
      });

    progression.currentWeight =
      progressionResult.nextWeight;

    progression.targetSets =
      progressionResult.targetSets;

    progression.targetReps =
      progressionResult.targetReps;

    progression.failureCount =
      progressionResult.failureCount;

    progression.status =
      progressionResult.status;

    progression.lastUpdated =
      new Date();

    await progression.save();

    res.status(201).json({
      success: true,

      message:
        progressionResult.message,

      workoutLog,

      nextTarget: {
        exercise:
          exercise.name,

        weight:
          progression.currentWeight,

        sets:
          progression.targetSets,

        reps:
          progression.targetReps,

        status:
          progression.status
      }
    });
  } catch (error) {
    next(error);
  }
};

const getWorkoutHistory = async (
  req,
  res,
  next
) => {
  try {
    const history =
      await WorkoutLog.find({
        userId: req.userId
      })
        .populate(
          "exerciseId",
          "name muscleGroup equipment"
        )
        .sort({
          date: -1
        });

    res.json({
      success: true,
      history
    });
  } catch (error) {
    next(error);
  }
};

const getTodayWorkout = async (
  req,
  res,
  next
) => {
  try {
    const startOfDay =
      new Date();

    startOfDay.setHours(
      0,
      0,
      0,
      0
    );

    const endOfDay =
      new Date();

    endOfDay.setHours(
      23,
      59,
      59,
      999
    );

    const workouts =
      await WorkoutLog.find({
        userId: req.userId,

        date: {
          $gte: startOfDay,
          $lte: endOfDay
        }
      })
        .populate(
          "exerciseId",
          "name muscleGroup equipment"
        )
        .sort({
          date: -1
        });

    res.json({
      success: true,
      workouts
    });
  } catch (error) {
    next(error);
  }
};

export {
  logWorkout,
  getWorkoutHistory,
  getTodayWorkout
};