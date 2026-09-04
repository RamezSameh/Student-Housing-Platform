import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    authService
      .getMe()
      .then((me) => {
        const normalized = {
          email: me.email,
          firstName: me.firstName,
          lastName: me.lastName,
          roles: me.roles || [],
          nationalId: me.nationalId || "",
          universityId: me.universityId || "",
          university: me.university || "",
          mobile: me.mobile || "",
        };
        localStorage.setItem("user", JSON.stringify(normalized));
        setUser(normalized);
      })
      .catch(() => {
        // Keep the local session if the backend profile endpoint is temporarily unavailable.
        // A real 401 is handled by the global event below.
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const onUnauthorized = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: !!localStorage.getItem("token"),
      isAdmin: user?.roles?.some((r) => r.toLowerCase() === "admin") || false,
      isOwner: user?.roles?.some((r) => r.toLowerCase() === "owner") || false,
      login: async (credentials) => {
        const data = await authService.login(credentials);
        setUser({
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          roles: data.roles || [],
          nationalId: data.nationalId || "",
          universityId: data.universityId || "",
          university: data.university || "",
          mobile: data.mobile || "",
        });
        return data;
      },
      register: async (payload) => {
        const data = await authService.register(payload);
        if (data.token) {
          setUser({
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            roles: data.roles || ["Student"],
            nationalId: data.nationalId || "",
            universityId: data.universityId || "",
            university: data.university || "",
            mobile: data.mobile || "",
          });
        }
        return data;
      },
      logout: () => {
        authService.logout();
        setUser(null);
      },
      refreshUser: async () => {
        const me = await authService.getMe();
        const normalized = {
          email: me.email,
          firstName: me.firstName,
          lastName: me.lastName,
          roles: me.roles || [],
          nationalId: me.nationalId || "",
          universityId: me.universityId || "",
          university: me.university || "",
          mobile: me.mobile || "",
        };
        localStorage.setItem("user", JSON.stringify(normalized));
        setUser(normalized);
        return normalized;
      },
    }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
