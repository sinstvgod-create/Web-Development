import exercises from "../data/exercises.js";

const generateWorkoutPlan = (profile) => {
  const {
    physiqueGoal,
    experience,
    equipment,
    workoutDays
  } = profile;

  const numberOfDays =
    Math.min(
      Math.max(Number(workoutDays) || 3, 1),
      7
    );

  const userEquipment =
    equipment?.toLowerCase() || "gym";

  const compatibleExercises =
    exercises.filter((exercise) => {
      const equipmentMatches =
        userEquipment === "gym" ||
        exercise.equipment.toLowerCase() ===
          userEquipment ||
        exercise.equipment === "Bodyweight";

      const goalMatches =
        !physiqueGoal ||
        exercise.goals.includes(
          physiqueGoal
        );

      const difficultyMatches =
        !experience ||
        exercise.difficulty === experience ||
        experience === "advanced" ||
        (
          experience === "intermediate" &&
          exercise.difficulty !== "advanced"
        );

      return (
        equipmentMatches &&
        goalMatches &&
        difficultyMatches
      );
    });

  const muscleGroups = [
    "Chest",
    "Back",
    "Legs",
    "Shoulders",
    "Arms",
    "Core"
  ];

  const plans = [];

  for (
    let day = 0;
    day < numberOfDays;
    day++
  ) {
    const muscleGroup =
      muscleGroups[
        day % muscleGroups.length
      ];

    let dayExercises =
      compatibleExercises.filter(
        (exercise) =>
          exercise.muscleGroup ===
          muscleGroup
      );

    if (dayExercises.length === 0) {
      dayExercises =
        compatibleExercises.slice(
          0,
          4
        );
    }

    dayExercises =
      dayExercises.slice(0, 4);

    const exercisesForDay =
      dayExercises.map((exercise) => ({
        exerciseId: exercise.name,

        name: exercise.name,

        muscleGroup:
          exercise.muscleGroup,

        equipment:
          exercise.equipment,

        sets:
          exercise.defaultSets,

        reps:
          exercise.defaultReps,

        progressionType:
          exercise.progressionType
      }));

    plans.push({
      day: day + 1,

      title:
        `${muscleGroup} Focus`,

      description:
        `Personalized ${muscleGroup.toLowerCase()} workout`,

      duration: "45-60 min",

      difficulty:
        experience || "beginner",

      exercises:
        exercisesForDay
    });
  }

  return {
    goal: physiqueGoal,
    workoutDays: numberOfDays,
    plan: plans
  };
};

export default generateWorkoutPlan;