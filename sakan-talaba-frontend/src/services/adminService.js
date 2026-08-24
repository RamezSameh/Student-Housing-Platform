import api from "./api";

export const getDashboard = async () => {
  const { data } = await api.get("/Admin/dashboard");
  return data;
};

export const getAdminUsers = async () => {
  const { data } = await api.get("/Admin/customers");
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
