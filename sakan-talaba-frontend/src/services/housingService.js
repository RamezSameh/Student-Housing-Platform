import api from "./api";

// ==========================================
// Get Housing List / Search
// ==========================================
export const getHousings = async (
  filters = {},
  page = 1,
  pageSize = 20
) => {
  const params = {
    page,
    pageSize,
  };

  Object.entries(filters).forEach(([key, value]) => {
    if (
      value !== "" &&
      value !== null &&
      value !== undefined
    ) {
      params[key] = value;
    }
  });

  const response = await api.get("/Housings/search", {
    params,
  });

  return response.data;
};

// ==========================================
// Get Housing By Id
// ==========================================
export const getHousingById = async (id) => {
  const response = await api.get(`/Housings/${id}`);

  return response.data;
};

// ==========================================
// Recommended Housing
//
// IMPORTANT:
// We intentionally use /Housings/search
// instead of /Housings/recommended
// ==========================================
export const getRecommendedHousing = async (
  filters = {},
  page = 1,
  pageSize = 6
) => {
  return getHousings(filters, page, pageSize);
};

// ==========================================
// Get Housing Types
// ==========================================
export const getHousingTypes = async () => {
  const response = await api.get("/Housings/types");

  return response.data;
};

// ==========================================
// Get Nearby Housing
// ==========================================
export const getNearbyHousing = async (
  universityId,
  radius = 2,
  page = 1,
  pageSize = 20
) => {
  const response = await api.get("/Housings/nearby", {
    params: {
      universityId,
      radius,
      page,
      pageSize,
    },
  });

  return response.data;
};