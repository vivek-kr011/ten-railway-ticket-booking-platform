import api from "./axios";

export const getDashboardStats = async () => {
  const response = await api.get("/admin/dashboard");

  return response.data;
};

export const createTrain = async (trainData) => {
  const response = await api.post("/admin/trains", trainData);

  return response.data;
};

export const fetchStations = async () => {
  const response = await api.get("/stations");

  return response.data;
};

export const getAllTrains = async () => {
  const response = await api.get("/admin/trains");
  
  return response.data;
};

export const updateTrain = async (trainId, trainData) => {
  const response = await api.put(`/admin/trains/${trainId}`, trainData);

  return response.data;
};

export const deleteTrain = async (trainId) => {
  const response = await api.delete(`/admin/trains/${trainId}`);

  return response.data;
};

export const createSchedule = async (scheduleData) => {
  const response = await api.post("/schedules", scheduleData);

  return response.data;
};