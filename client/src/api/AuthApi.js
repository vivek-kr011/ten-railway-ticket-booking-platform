/* eslint-disable no-useless-catch */
import api from "./axios";

export const signupUser = async (userData) => {
  try {
    const response = await api.post("/auth/register", userData);

    return response.data;
  } catch (error) {
    throw error;
  }
};

export const loginUser = async (loginData) => {

  const response = await api.post("/auth/login", loginData);

  return response.data;
}

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");

  return response.data;
}