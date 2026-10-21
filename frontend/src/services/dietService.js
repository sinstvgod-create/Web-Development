import api from "./api";

const getDietPlan = async () => {
  const response = await api.get("/plan/diet");

  return response.data;
};

export {
  getDietPlan
};