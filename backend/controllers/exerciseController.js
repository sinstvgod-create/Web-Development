import Exercise from "../models/Exercise.js";

const getExercises = async (
  req,
  res,
  next
) => {
  try {
    const {
      muscleGroup,
      equipment,
      difficulty,
      goal,
      search
    } = req.query;

    const filter = {};

    if (muscleGroup) {
      filter.muscleGroup =
        muscleGroup;
    }

    if (equipment) {
      filter.equipment =
        equipment;
    }

    if (difficulty) {
      filter.difficulty =
        difficulty;
    }

    if (goal) {
      filter.goals = goal;
    }

    if (search) {
      filter.name = {
        $regex: search,
        $options: "i"
      };
    }

    const exercises =
      await Exercise.find(
        filter
      ).sort({
        name: 1
      });

    res.json({
      success: true,
      count: exercises.length,
      exercises
    });
  } catch (error) {
    next(error);
  }
};

const getExerciseById = async (
  req,
  res,
  next
) => {
  try {
    const exercise =
      await Exercise.findById(
        req.params.id
      );

    if (!exercise) {
      return res.status(404).json({
        success: false,
        message:
          "Exercise not found"
      });
    }

    res.json({
      success: true,
      exercise
    });
  } catch (error) {
    next(error);
  }
};

export {
  getExercises,
  getExerciseById
};