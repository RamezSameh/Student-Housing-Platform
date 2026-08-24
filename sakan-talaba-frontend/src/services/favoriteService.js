import api from "./api";

export const getFavorites = async () => {
  const { data } = await api.get("/Favorites");
  return data;
};

export const addFavorite = async (housingId) => {
  const { data } = await api.post(`/Favorites/${housingId}`);
  return data;
};

export const removeFavorite = async (housingId) => {
  const { data } = await api.delete(`/Favorites/${housingId}`);
  return data;
};
