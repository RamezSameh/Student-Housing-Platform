import api from "./api";

// GET /api/Admin/dashboard — real server-side stats, including an accurate
// TotalBookings count (the old /Admin/bookings scoping bug is now fixed
// server-side, and this dedicated endpoint never had that bug to begin with).
export const getDashboardStats = async () => {
  const { data } = await api.get("/Admin/dashboard");
  const stats = data?.data ?? data;
  return {
    totalUsers: stats?.totalUsers ?? 0,
    totalStudents: stats?.totalStudents ?? 0,
    totalOwners: stats?.totalOwners ?? 0,
    totalUniversities: stats?.totalUniversities ?? 0,
    totalHousing: stats?.totalHousing ?? 0,
    verifiedHousing: stats?.verifiedHousing ?? 0,
    pendingHousing: stats?.pendingHousing ?? 0,
    totalBookings: stats?.totalBookings ?? 0,
    pendingBookings: stats?.pendingBookings ?? 0,
  };
};

export const getAdminUsers = async () => {
  const { data } = await api.get("/Admin/customers");
  return data;
};

// GET /api/Admin/housings/pending
export const getPendingHousings = async () => {
  const { data } = await api.get("/Admin/housings/pending");
  return data?.data ?? data;
};

// POST /api/Admin/housings/{id}/verify
export const setHousingVerified = async (id, isVerified) => {
  const { data } = await api.post(`/Admin/housings/${id}/verify`, { isVerified });
  return data;
};

export const promoteToAdmin = async (email) => {
  const { data } = await api.post("/Admin/users/promote", { email });
  return data;
};

export const demoteFromAdmin = async (email) => {
  const { data } = await api.post("/Admin/users/demote", { email });
  return data;
};

export const getHousingTypes = async () => {
  const { data } = await api.get("/Admin/housing-types");
  return data;
};

export const createHousingType = async (payload) => {
  const { data } = await api.post("/Admin/housing-types", payload);
  return data;
};

export const updateHousingType = async (id, payload) => {
  const { data } = await api.put(`/Admin/housing-types/${id}`, payload);
  return data;
};

export const deleteHousingType = async (id) => {
  const { data } = await api.delete(`/Admin/housing-types/${id}`);
  return data;
};
