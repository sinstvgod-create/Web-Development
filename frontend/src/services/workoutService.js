import api from "./api";

const logWorkout = async (workoutData) => {
  const response = await api.post(
    "/workouts/log",
    workoutData
  );

  return response.data;
};

const getWorkoutHistory = async () => {
  const response = await api.get(
    "/workouts/history"
  );

  return response.data;
};

const getTodayWorkouts = async () => {
  const response = await api.get(
    "/workouts/today"
  );

  return response.data;
};

export {
  logWorkout,
  getWorkoutHistory,
  getTodayWorkouts
};