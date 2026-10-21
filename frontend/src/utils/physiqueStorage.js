// Get the currently active physique goal (defaults to "lean")
export const getCurrentPhysique = () => {
  return localStorage.getItem("gymfit_physique_goal") || "lean";
};

// Retrieve data scoped specifically to the active physique
export const getPhysiqueData = (key, defaultValue) => {
  const physique = getCurrentPhysique();
  const saved = localStorage.getItem(`overload_${physique}_${key}`);
  return saved ? JSON.parse(saved) : defaultValue;
};

// Save data scoped to the active physique
export const setPhysiqueData = (key, data) => {
  const physique = getCurrentPhysique();
  localStorage.setItem(`overload_${physique}_${key}`, JSON.stringify(data));
};

// Nutrition and macro modifiers tailored for each of the 10 physiques
export const getPhysiqueNutritionModifiers = (baseCals) => {
  const physique = getCurrentPhysique();
  switch (physique) {
    case "bulk":
    case "bodybuilder":
      return { calorieMultiplier: 1.15, proteinMultiplier: 1.2, label: "Hypertrophy Surplus" };
    case "lean":
    case "toned":
      return { calorieMultiplier: 0.85, proteinMultiplier: 1.1, label: "Fat Loss Deficit" };
    case "power":
      return { calorieMultiplier: 1.05, proteinMultiplier: 1.15, label: "Strength Maintenance" };
    case "endurance":
    case "crossfit":
    case "calisthenics":
      return { calorieMultiplier: 1.1, proteinMultiplier: 1.0, label: "High Energy Expenditure" };
    case "recomp":
    default:
      return { calorieMultiplier: 1.0, proteinMultiplier: 1.1, label: "Neutral Recomposition" };
  }
};