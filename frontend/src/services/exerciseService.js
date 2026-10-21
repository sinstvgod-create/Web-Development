import api from "./api";

const getExercises = async (params = {}) => {
  const response = await api.get(
    "/exercises",
    { params }
  );

  return response.data;
};

const getExerciseById = async (exerciseId) => {
  const response = await api.get(
    `/exercises/${exerciseId}`
  );

  return response.data;
};

export {
  getExercises,
  getExerciseById
};