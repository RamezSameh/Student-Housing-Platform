import api from "./api";

export const getMyBookings = async () => {
  const { data } = await api.get("/Bookings/my-bookings");
  return Array.isArray(data) ? data : data?.items || [];
};

export const getBookingById = async (id) => {
  const { data } = await api.get(`/Bookings/${id}`);
  return data;
};

export const createBooking = async ({
  roomId,
  checkIn,
  checkOut,
  nationalId,
  universityId,
  fullName,
  mobile,
  email,
  durationMonths,
  notes,
  paymentMethod,
}) => {
  const { data } = await api.post("/Bookings", {
    roomId,
    checkIn,
    checkOut,
    nationalId,
    universityId,
    fullName,
    mobile,
    email,
    durationMonths,
    notes,
    paymentMethod,
  });
  return data;
};

export const createHousingBooking = async ({
  housingRoomId,
  checkIn,
  checkOut,
  nationalId,
  universityId,
  studentName,
  mobile,
  email,
  durationMonths,
  notes,
  paymentMethod,
}) => {
  const payload = {
    housingRoomId,
    checkIn,
    checkOut,
    nationalId,
    universityId,
    studentName,
    mobile,
    email,
    durationMonths,
    notes,
    paymentMethod,
  };
  try {
    const { data } = await api.post("/Bookings/housing", payload);
    return data;
  } catch (error) {
    console.error("Create housing booking failed:", {
      payload,
      status: error.response?.status,
      response: error.response?.data,
    });
    throw error;
  }
};

export const confirmPayment = async (bookingId, transactionId) => {
  const { data } = await api.post("/Bookings/confirm-payment", {
    bookingId,
    transactionId,
  });
  return data;
};

export const cancelBooking = async (bookingId) => {
  await api.post(`/Bookings/${bookingId}/cancel`);
};
