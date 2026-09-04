import api from "./api";

// POST /api/Contact — authenticated users only.
export const sendContactMessage = async (payload) => {
  const { data } = await api.post("/Contact", payload);
  return data?.data ?? data;
};
