import api from "./axios";

export const fetchStations = async () => {
  const response = await api.get("/stations");

  return response.data; 
};

// stationData => station details (name, code, city, aur state)
export const createStation = async (stationData) => {
  const response = await api.post("/stations", stationData);

  return response.data;
}