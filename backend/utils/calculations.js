const calculateBMI = (weight, height) => {
  if (!weight || !height) {
    return 0;
  }

  const heightInMeters = height / 100;

  return weight / (
    heightInMeters * heightInMeters
  );
};

const calculateBMR = (
  weight,
  height,
  age,
  gender
) => {
  if (!weight || !height || !age) {
    return 0;
  }

  if (gender === "male") {
    return (
      (10 * weight) +
      (6.25 * height) -
      (5 * age) +
      5
    );
  }

  return (
    (10 * weight) +
    (6.25 * height) -
    (5 * age) -
    161
  );
};

const getActivityMultiplier = (
  activityLevel
) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    "very-active": 1.725
  };

  return (
    multipliers[activityLevel] || 1.2
  );
};

const calculateMaintenanceCalories = (
  weight,
  height,
  age,
  gender,
  activityLevel
) => {
  const bmr = calculateBMR(
    weight,
    height,
    age,
    gender
  );

  const multiplier =
    getActivityMultiplier(activityLevel);

  return Math.round(
    bmr * multiplier
  );
};

const calculateDailyCalories = (
  weight,
  height,
  age,
  gender,
  activityLevel,
  physiqueGoal
) => {
  const maintenanceCalories =
    calculateMaintenanceCalories(
      weight,
      height,
      age,
      gender,
      activityLevel
    );

  if (physiqueGoal === "bulk") {
    return maintenanceCalories + 250;
  }

  if (physiqueGoal === "lean") {
    return maintenanceCalories - 250;
  }

  if (physiqueGoal === "toned") {
    return maintenanceCalories - 100;
  }

  return maintenanceCalories;
};

const calculateProtein = (
  weight,
  physiqueGoal
) => {
  if (!weight) {
    return 0;
  }

  if (physiqueGoal === "bulk") {
    return Math.round(weight * 2);
  }

  return Math.round(weight * 1.8);
};

const calculateMacros = (
  calories,
  protein
) => {
  const proteinCalories = protein * 4;

  const remainingCalories =
    calories - proteinCalories;

  const fatCalories =
    calories * 0.25;

  const carbCalories =
    remainingCalories - fatCalories;

  return {
    protein,
    carbs: Math.round(
      carbCalories / 4
    ),
    fat: Math.round(
      fatCalories / 9
    )
  };
};

export {
  calculateBMI,
  calculateBMR,
  getActivityMultiplier,
  calculateMaintenanceCalories,
  calculateDailyCalories,
  calculateProtein,
  calculateMacros
};