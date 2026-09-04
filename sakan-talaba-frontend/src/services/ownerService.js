import api from "./api";

// GET /api/Owner/dashboard
export const getOwnerDashboard = async () => {
  const { data } = await api.get("/Owner/dashboard");
  return data?.data ?? data;
};

// GET /api/Owner/housings
export const getMyHousings = async () => {
  const { data } = await api.get("/Owner/housings");
  return data?.data ?? data;
};

// GET /api/Owner/bookings
export const getMyHousingBookings = async () => {
  const { data } = await api.get("/Owner/bookings");
  return data?.data ?? data;
};

export const approveBooking = async (bookingId) => {
  const { data } = await api.post(`/Owner/bookings/${bookingId}/approve`);
  return data;
};

export const rejectBooking = async (bookingId) => {
  const { data } = await api.post(`/Owner/bookings/${bookingId}/reject`);
  return data;
};

// POST /api/housings
export const createHousing = async (payload) => {
  const { data } = await api.post("/housings", payload);
  return data?.data ?? data;
};

// PUT /api/housings/{id}
export const updateHousing = async (id, payload) => {
  const { data } = await api.put(`/housings/${id}`, payload);
  return data;
};

// DELETE /api/housings/{id}
export const deleteHousing = async (id) => {
  const { data } = await api.delete(`/housings/${id}`);
  return data;
};

// POST /api/housings/{id}/images  (multipart/form-data)
export const uploadHousingImage = async (id, file, isPrimary = false) => {
  const form = new FormData();
  form.append("file", file);
  form.append("isPrimary", isPrimary);
  const { data } = await api.post(`/housings/${id}/images`, form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
};

// DELETE /api/housings/images/{imageId}
export const deleteHousingImage = async (imageId) => {
  const { data } = await api.delete(`/housings/images/${imageId}`);
  return data;
};
