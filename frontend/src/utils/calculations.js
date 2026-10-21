const calculateBMI = (weight, height) => {
  const heightInMeters = height / 100;

  if (!weight || !heightInMeters) {
    return 0;
  }

  return weight / (heightInMeters * heightInMeters);
};

const calculateBMR = (weight, height, age, gender) => {
  if (!weight || !height || !age) {
    return 0;
  }

  if (gender === "male") {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  }

  return (10 * weight) + (6.25 * height) - (5 * age) - 161;
};

const getActivityMultiplier = (activityLevel) => {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    "very-active": 1.725
  };

  return multipliers[activityLevel] || 1.2;
};

const calculateDailyCalories = (
  weight,
  height,
  age,
  gender,
  activityLevel,
  physiqueGoal
) => {
  const bmr = calculateBMR(
    weight,
    height,
    age,
    gender
  );

  const maintenanceCalories =
    bmr * getActivityMultiplier(activityLevel);

  if (physiqueGoal === "bulk") {
    return Math.round(maintenanceCalories + 250);
  }

  if (physiqueGoal === "lean") {
    return Math.round(maintenanceCalories - 250);
  }

  return Math.round(maintenanceCalories);
};

const calculateProtein = (weight, physiqueGoal) => {
  if (!weight) {
    return 0;
  }

  if (physiqueGoal === "bulk") {
    return Math.round(weight * 2);
  }

  return Math.round(weight * 1.8);
};

export {
  calculateBMI,
  calculateBMR,
  calculateDailyCalories,
  calculateProtein
};