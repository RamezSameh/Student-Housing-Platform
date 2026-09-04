import api from "./api";

export const login = async (credentials) => {
  const { data } = await api.post("/Accounts/login", credentials);
  localStorage.setItem("token", data.token);
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      roles: data.roles || [],
    })
  );
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post("/Accounts/register", payload);
  if (data.token) {
    localStorage.setItem("token", data.token);
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: data.roles || ["Customer"],
      })
    );
  }
  return data;
};

export const getMe = async () => {
  const { data } = await api.get("/Accounts/me");
  return data;
};

export const updateMe = async (payload) => {
  const { data } = await api.put("/Accounts/me", payload);
  return data;
};

export const changePassword = async (payload) => {
  await api.post("/Accounts/change-password", payload);
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};
