import api from "./api";

const registerUser = async (userData) => {
  const response = await api.post("/auth/register", userData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

const loginUser = async (userData) => {
  const response = await api.post("/auth/login", userData);

  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
  }

  return response.data;
};

const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
};

const logoutUser = () => {
  localStorage.removeItem("token");
};

export {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser
};