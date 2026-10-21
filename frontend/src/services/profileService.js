import api from "./api";

const getProfile = async () => {
  const response = await api.get("/profile");

  return response.data;
};

const updateProfile = async (profileData) => {
  const response = await api.put("/profile", profileData);

  return response.data;
};

export {
  getProfile,
  updateProfile
};