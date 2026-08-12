import api from "./api";

export const getHousings = async (page = 1, pageSize = 9) => {
  const response = await api.get("/Housings/search", {
    params: {
      page,
      pageSize,
    },
  });

  return response.data;
};

export const getRecommendedHousing = async (
  page = 1,
  pageSize = 6
) => {
  const response = await api.get("/Housings/recommended", {
    params: {
      page,
      pageSize,
    },
  });

  return response.data;
};