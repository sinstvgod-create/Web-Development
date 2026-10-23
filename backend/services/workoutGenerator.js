const calculateStartingWeight = (
  experience,
  muscleGroup,
  exerciseName,
  equipment
) => {
  const baseWeights = {
    beginner: 10,
    intermediate: 20,
    advanced: 30
  };

  let weight =
    baseWeights[experience] || 10;

  const bodyweightExercises = [
    "Push Ups",
    "Dips",
    "Plank",
    "Hanging Leg Raise",
    "Walking Lunges"
  ];

  if (
    bodyweightExercises.includes(
      exerciseName
    )
  ) {
    return 0;
  }

  if (muscleGroup === "Core") {
    return 0;
  }

  if (equipment === "Dumbbell") {
    if (
      exerciseName ===
      "Lateral Raises"
    ) {
      return experience === "beginner"
        ? 5
        : experience === "intermediate"
        ? 7.5
        : 10;
    }

    if (
      exerciseName ===
        "Dumbbell Bicep Curl" ||
      exerciseName ===
        "Dumbbell Shoulder Press"
    ) {
      return experience === "beginner"
        ? 7.5
        : experience === "intermediate"
        ? 10
        : 15;
    }

    if (
      exerciseName ===
      "Dumbbell Row"
    ) {
      return experience === "beginner"
        ? 10
        : experience === "intermediate"
        ? 15
        : 20;
    }
  }

  if (
    equipment === "Barbell"
  ) {
    if (
      exerciseName ===
      "Barbell Bench Press"
    ) {
      return experience === "beginner"
        ? 20
        : experience === "intermediate"
        ? 40
        : 60;
    }

    if (
      exerciseName ===
      "Barbell Squat"
    ) {
      return experience === "beginner"
        ? 20
        : experience === "intermediate"
        ? 40
        : 60;
    }

    if (
      exerciseName ===
      "Barbell Deadlift"
    ) {
      return experience === "beginner"
        ? 30
        : experience === "intermediate"
        ? 50
        : 70;
    }

    if (
      exerciseName ===
      "Barbell Bicep Curl"
    ) {
      return experience === "beginner"
        ? 10
        : experience === "intermediate"
        ? 15
        : 20;
    }

    if (
      exerciseName ===
      "Romanian Deadlift"
    ) {
      return experience === "beginner"
        ? 20
        : experience === "intermediate"
        ? 40
        : 60;
    }
  }

  if (
    exerciseName ===
    "Leg Press"
  ) {
    return experience === "beginner"
      ? 40
      : experience === "intermediate"
      ? 80
      : 120;
  }

  if (
    exerciseName ===
    "Goblet Squat"
  ) {
    return experience === "beginner"
      ? 10
      : experience === "intermediate"
      ? 20
      : 30;
  }

  if (
    exerciseName ===
    "Seated Cable Row" ||
    exerciseName ===
    "Lat Pulldown" ||
    exerciseName ===
    "Tricep Pushdown"
  ) {
    return experience === "beginner"
      ? 15
      : experience === "intermediate"
      ? 25
      : 35;
  }

  if (
    exerciseName ===
    "Incline Dumbbell Press"
  ) {
    return experience === "beginner"
      ? 10
      : experience === "intermediate"
      ? 15
      : 20;
  }

  return weight;
};

const generateWorkoutSession = (
  workoutDay,
  profile
) => {
  if (!workoutDay) {
    return null;
  }

  const experience =
    profile?.experience ||
    "beginner";

  const exercises =
    workoutDay.exercises || [];

  const sessionExercises =
    exercises.map((exercise) => {
      const startingWeight =
        calculateStartingWeight(
          experience,
          exercise.muscleGroup,
          exercise.name,
          exercise.equipment
        );

      return {
        exerciseId:
          exercise.exerciseId,

        name:
          exercise.name,

        muscleGroup:
          exercise.muscleGroup,

        equipment:
          exercise.equipment,

        sets:
          exercise.sets || 3,

        reps:
          exercise.reps || 10,

        weight:
          startingWeight,

        progressionType:
          exercise.progressionType ||
          "weight",

        target:
          `${startingWeight} kg × ${
            exercise.sets || 3
          } × ${
            exercise.reps || 10
          }`
      };
    });

  return {
    day:
      workoutDay.day,

    title:
      workoutDay.title,

    description:
      workoutDay.description,

    duration:
      workoutDay.duration,

    difficulty:
      workoutDay.difficulty,

    exercises:
      sessionExercises
  };
};

export {
  calculateStartingWeight,
  generateWorkoutSession
};