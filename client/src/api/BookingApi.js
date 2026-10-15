import api from "./axios";

export const getMyBookings = async () => {
  const response = await api.get("/bookings");

  return response.data;
};

export const getSingleBooking = async (id) => {
  const response = await api.get(`/bookings/${id}`);

  return response.data;
};

export const cancelBooking = async (id) => {
  const response = await api.delete(`/bookings/${id}`);

  return response.data;
}