import api from "./api";

// POST /api/Contact — public, no login required.
export const sendContactMessage = async (payload) => {
  const { data } = await api.post("/Contact", payload);
  return data?.data ?? data;
};
