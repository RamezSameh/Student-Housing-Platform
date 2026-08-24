import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as favoriteService from "../services/favoriteService";
import { useAuth } from "./AuthContext";

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [favoriteIds, setFavoriteIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [busyIds, setBusyIds] = useState(() => new Set());

  const refresh = useCallback(async () => {
    if (!isAuthenticated) {
      setFavoriteIds([]);
      return;
    }
    setLoading(true);
    try {
      const data = await favoriteService.getFavorites();
      const ids = (Array.isArray(data) ? data : []).map((f) =>
        Number(f.housingId ?? f.HousingId ?? f.id)
      );
      setFavoriteIds(ids);
    } catch {
      // Keep whatever we had; the favorites badge/heart just won't update this time.
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isFavorite = useCallback(
    (housingId) => favoriteIds.includes(Number(housingId)),
    [favoriteIds]
  );

  const toggleFavorite = useCallback(
    async (housingId) => {
      const id = Number(housingId);
      if (!id || !isAuthenticated) return { ok: false, requiresAuth: !isAuthenticated };

      setBusyIds((prev) => new Set(prev).add(id));
      const currentlyFavorite = favoriteIds.includes(id);

      try {
        if (currentlyFavorite) {
          await favoriteService.removeFavorite(id);
          setFavoriteIds((prev) => prev.filter((f) => f !== id));
        } else {
          await favoriteService.addFavorite(id);
          setFavoriteIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
        }
        return { ok: true };
      } catch (err) {
        return { ok: false, error: err };
      } finally {
        setBusyIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    },
    [favoriteIds, isAuthenticated]
  );

  const value = useMemo(
    () => ({
      favoriteIds,
      loading,
      count: favoriteIds.length,
      isFavorite,
      isBusy: (housingId) => busyIds.has(Number(housingId)),
      toggleFavorite,
      refresh,
    }),
    [favoriteIds, loading, busyIds, isFavorite, toggleFavorite, refresh]
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export const useFavorites = () => useContext(FavoritesContext);
