import api from "./api";

export const getMyBookings = async () => {
  const { data } = await api.get("/Bookings/my-bookings");
  return Array.isArray(data) ? data : data?.items || [];
};

export const getBookingById = async (id) => {
  const { data } = await api.get(`/Bookings/${id}`);
  return data;
};

export const createBooking = async ({ roomId, checkIn, checkOut }) => {
  const { data } = await api.post("/Bookings", {
    roomId,
    checkIn,
    checkOut,
  });
  return data;
};

export const createHousingBooking = async ({
  housingRoomId,
  checkIn,
  checkOut,
}) => {
  const { data } = await api.post("/Bookings/housing", {
    housingRoomId,
    checkIn,
    checkOut,
  });
  return data;
};

export const confirmPayment = async (bookingId, transactionId) => {
  const { data } = await api.post("/Bookings/confirm-payment", {
    bookingId,
    transactionId,
  });
  return data;
};
