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
  const { data } = await api.post("/Bookings/housing", {
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

/**
 * Starts a real Paymob payment. The backend returns the URL the student must
 * be redirected to (Paymob card page, or the wallet provider for mobile
 * wallets). paymentType: "card" (default) or "wallet".
 */
export const initiatePaymobPayment = async (bookingId, paymentType = "card", walletNumber = null) => {
  const { data } = await api.post("/Payments/paymob/initiate", {
    bookingId,
    paymentType,
    walletNumber,
  });
  return data; // { paymentUrl, paymobOrderId }
};

export const cancelBooking = async (bookingId) => {
  await api.post(`/Bookings/${bookingId}/cancel`);
};
