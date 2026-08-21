import api from "./api";

export const getHousingTypes = async () => {
  const response = await api.get("/Housings/types");

  return response.data;
};