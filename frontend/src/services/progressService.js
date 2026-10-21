import api from "./api";

const getProgress = async () => {
  const response = await api.get("/progress");

  return response.data;
};

const getExerciseProgress = async (exerciseId) => {
  const response = await api.get(
    `/progress/${exerciseId}`
  );

  return response.data;
};

export {
  getProgress,
  getExerciseProgress
};