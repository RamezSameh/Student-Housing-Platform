import api from "./api";

// ==========================================
// Get Universities
// ==========================================
export const getUniversities = async (
  page = 1,
  pageSize = 100
) => {
  const response = await api.get("/Universities", {
    params: {
      page,
      pageSize,
    },
  });

  return response.data;
};

// ==========================================
// Get University By Id
// ==========================================
export const getUniversityById = async (id) => {
  const response = await api.get(`/Universities/${id}`);

  return response.data;
};