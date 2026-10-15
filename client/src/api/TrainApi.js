import api from "./axios";

export const searchTrains = async ({ source, destination, journeyDate }) => {
  const response = await api.get("/trains/search", {
    params: {
      source,
      destination,
      journeyDate,
    },
  });

  return response.data;
};
