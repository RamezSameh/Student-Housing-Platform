import api from "./api";

// =====================================
// Create Housing Booking
// =====================================
export const createHousingBooking = async ({
    housingRoomId,
    checkIn,
    checkOut,
}) => {
    const response = await api.post("/Bookings/housing", {
        housingRoomId,
        checkIn,
        checkOut,
    });

    return response.data;
};

// =====================================
// Legacy Room Booking
// =====================================
export const createBooking = async ({
    roomId,
    checkIn,
    checkOut,
}) => {
    const response = await api.post("/Bookings", {
        roomId,
        checkIn,
        checkOut,
    });

    return response.data;
};

// =====================================
// Get My Bookings
// =====================================
export const getMyBookings = async () => {
    const response = await api.get("/Bookings/my-bookings");

    return response.data;
};

// =====================================
// Get Booking By ID
// =====================================
export const getBookingById = async (id) => {
    const response = await api.get(`/Bookings/${id}`);

    return response.data;
};

// =====================================
// Confirm Payment
// =====================================
export const confirmPayment = async ({
    bookingId,
    transactionId,
}) => {
    const response = await api.post(
        "/Bookings/confirm-payment",
        {
            bookingId,
            transactionId,
        }
    );

    return response.data;
};