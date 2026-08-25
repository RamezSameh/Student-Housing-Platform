import api from "./api";
import { getUniversities } from "./universityService";
import { getHousings } from "./housingService";

// NOTE: the backend does not expose a dedicated "/Admin/dashboard" endpoint.
// We build the dashboard stats client-side from the endpoints that DO exist.
export const getDashboardStats = async () => {
  const [customers, housingTypes, universitiesRes, housingRes] = await Promise.all([
    getAdminUsers(),
    getHousingTypes(),
    getUniversities(1, 1),
    getHousings({}, 1, 200),
  ]);

  const users = Array.isArray(customers) ? customers : [];
  const hasRole = (u, role) => u.roles?.some((r) => r.toLowerCase() === role.toLowerCase());

  const housingItems = Array.isArray(housingRes?.items) ? housingRes.items : [];
  const verifiedHousing = housingItems.filter((h) => h.isVerified).length;
  const sampledHousing = housingItems.length;

  return {
    totalUsers: users.length,
    totalStudents: users.filter((u) => hasRole(u, "Student")).length,
    totalOwners: users.filter((u) => hasRole(u, "Owner")).length,
    totalAdmins: users.filter((u) => hasRole(u, "Admin")).length,
    totalUniversities: Number(universitiesRes?.totalCount ?? 0),
    totalHousingTypes: Array.isArray(housingTypes) ? housingTypes.length : 0,
    totalHousing: Number(housingRes?.totalCount ?? 0),
    verifiedHousing,
    pendingHousing: Math.max(sampledHousing - verifiedHousing, 0),
    sampledHousing,
  };
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
