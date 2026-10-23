const calculateVolume = (
  sets,
  reps,
  weight
) => {
  return sets * reps * weight;
};

const isSuccessfulWorkout = (
  actualSets,
  targetSets,
  actualReps,
  targetReps
) => {
  return (
    actualSets >= targetSets &&
    actualReps >= targetReps
  );
};

// Updated: Increase weight by 10% on success
const calculateNextWeight = (
  currentWeight
) => {
  const increased = currentWeight * 1.10;
  return Math.round(increased * 10) / 10;
};

const calculateNextReps = (
  currentReps,
  progressionType
) => {
  if (
    progressionType === "reps" ||
    progressionType === "weight-and-reps"
  ) {
    return currentReps + 1;
  }

  return currentReps;
};

// Updated: Deload weight by 5% on consecutive failures
const calculateDeloadWeight = (
  currentWeight
) => {
  return Math.max(
    0,
    currentWeight * 0.95
  );
};

const processProgression = ({
  currentWeight,
  targetSets,
  targetReps,
  actualSets,
  actualReps,
  failureCount = 0,
  progressionType = "weight"
}) => {
  const success =
    isSuccessfulWorkout(
      actualSets,
      targetSets,
      actualReps,
      targetReps
    );

  if (success) {
    const nextWeight =
      calculateNextWeight(
        currentWeight
      );

    const nextReps =
      calculateNextReps(
        targetReps,
        progressionType
      );

    return {
      result: "success",

      nextWeight,

      targetSets,

      targetReps: nextReps,

      failureCount: 0,

      status: "active",

      message:
        "Target completed. Your target weight has increased by 10%."
    };
  }

  const newFailureCount =
    failureCount + 1;

  if (newFailureCount >= 2) {
    const deloadWeight =
      calculateDeloadWeight(
        currentWeight
      );

    return {
      result: "failure",

      nextWeight:
        Math.round(
          deloadWeight * 10
        ) / 10,

      targetSets,

      targetReps,

      failureCount: 0,

      status: "deload",

      message:
        "Two consecutive failures. Your target has been deloaded by 5%."
    };
  }

  return {
    result: "failure",

    nextWeight:
      currentWeight,

    targetSets,

    targetReps,

    failureCount:
      newFailureCount,

    status: "active",

    message:
      "Target not completed. Repeat the current target."
  };
};

export {
  calculateVolume,
  isSuccessfulWorkout,
  calculateNextWeight,
  calculateNextReps,
  calculateDeloadWeight,
  processProgression
};