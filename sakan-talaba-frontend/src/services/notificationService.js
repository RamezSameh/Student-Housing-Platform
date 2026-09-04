import api from "./api";

// GET /api/Notifications
export const getNotifications = async () => {
  const { data } = await api.get("/Notifications");
  return Array.isArray(data) ? data : [];
};

// PUT /api/Notifications/{id}/read
export const markNotificationRead = async (id) => {
  const { data } = await api.put(`/Notifications/${id}/read`);
  return data;
};
