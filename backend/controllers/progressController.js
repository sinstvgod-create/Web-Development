import WorkoutLog from "../models/WorkoutLog.js";
import ProgressionState from "../models/ProgressionState.js";

const getProgress = async (
  req,
  res,
  next
) => {
  try {
    const workouts =
      await WorkoutLog.find({
        userId: req.userId
      })
        .populate(
          "exerciseId",
          "name muscleGroup equipment"
        )
        .sort({
          date: 1
        });

    const progression =
      await ProgressionState.find({
        userId: req.userId
      })
        .populate(
          "exerciseId",
          "name muscleGroup equipment"
        )
        .sort({
          lastUpdated: -1
        });

    const totalWorkouts =
      workouts.length;

    const successfulWorkouts =
      workouts.filter(
        (workout) =>
          workout.result === "success"
      ).length;

    const failedWorkouts =
      workouts.filter(
        (workout) =>
          workout.result === "failure"
      ).length;

    const totalVolume =
      workouts.reduce(
        (total, workout) =>
          total + workout.volume,
        0
      );

    const progressHistory =
      workouts.map(
        (workout) => ({
          date:
            workout.date,

          exercise:
            workout.exerciseId?.name ||
            "Unknown Exercise",

          weight:
            workout.weight,

          reps:
            workout.reps,

          sets:
            workout.sets,

          volume:
            workout.volume,

          result:
            workout.result
        })
      );

    res.json({
      success: true,

      summary: {
        totalWorkouts,
        successfulWorkouts,
        failedWorkouts,
        totalVolume
      },

      progressHistory,

      progression
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseProgress = async (
  req,
  res,
  next
) => {
  try {
    const {
      exerciseId
    } = req.params;

    const workouts =
      await WorkoutLog.find({
        userId: req.userId,
        exerciseId
      })
        .populate(
          "exerciseId",
          "name muscleGroup equipment"
        )
        .sort({
          date: 1
        });

    const progression =
      await ProgressionState.findOne({
        userId: req.userId,
        exerciseId
      }).populate(
        "exerciseId",
        "name muscleGroup equipment"
      );

    res.json({
      success: true,

      exercise:
        progression?.exerciseId ||
        workouts[0]?.exerciseId ||
        null,

      currentTarget:
        progression || null,

      history: workouts.map(
        (workout) => ({
          date:
            workout.date,

          weight:
            workout.weight,

          reps:
            workout.reps,

          sets:
            workout.sets,

          volume:
            workout.volume,

          result:
            workout.result
        })
      )
    });
  } catch (error) {
    next(error);
  }
};

export {
  getProgress,
  getExerciseProgress
};