import api from "./api";

const generatePlan = async () => {
  const response = await api.post("/plan/generate");

  return response.data;
};

const getWorkoutPlan = async () => {
  const response = await api.get("/plan/workout");

  return response.data;
};

const getDietPlan = async () => {
  const response = await api.get("/plan/diet");

  return response.data;
};

const getNextTarget = async () => {
  const response = await api.get("/plan/next");

  return response.data;
};

export {
  generatePlan,
  getWorkoutPlan,
  getDietPlan,
  getNextTarget
};