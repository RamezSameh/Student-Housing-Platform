import { Heart, MapPin, ShieldCheck, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addFavorite, removeFavorite } from "../services/favoriteService";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";

export default function HousingCard({ housing, favoriteIds = [], onFavoriteChange }) {
  const { isAuthenticated } = useAuth();
  const [favorite, setFavorite] = useState(favoriteIds.includes(housing.id));
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setFavorite(favoriteIds.includes(housing.id));
  }, [favoriteIds, housing.id]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      alert("Please login first.");
      return;
    }
    if (busy) return;
    setBusy(true);
    try {
      if (favorite) await removeFavorite(housing.id);
      else await addFavorite(housing.id);
      setFavorite(!favorite);
      onFavoriteChange?.(housing.id, !favorite);
    } catch (error) {
      alert(getApiError(error, "Could not update favorite."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative flex h-44 items-center justify-center bg-slate-100">
        <span className="text-sm text-slate-400">Housing image</span>
        <button
          onClick={toggleFavorite}
          disabled={busy}
          className="absolute right-3 top-3 rounded-full bg-white/95 p-2 shadow-sm disabled:opacity-50"
          aria-label="Favorite"
        >
          <Heart size={19} className={favorite ? "fill-red-500 text-red-500" : "text-slate-600"} />
        </button>
        {housing.isVerified && (
          <span className="absolute left-3 top-3 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            <ShieldCheck size={14} /> Verified
          </span>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="line-clamp-1 font-semibold text-slate-900">{housing.title}</h3>
          <span className="whitespace-nowrap font-bold text-slate-900">
            {Number(housing.price || 0).toLocaleString()} EGP
          </span>
        </div>

        <div className="mb-4 flex flex-wrap gap-3 text-sm text-slate-500">
          <span className="flex items-center gap-1"><MapPin size={15} /> {housing.city}</span>
          <span className="flex items-center gap-1"><Star size={15} /> {housing.rating ?? 0}</span>
          <span>{housing.distanceKm ?? 0} km</span>
        </div>

        <Link
          to={`/housing/${housing.id}`}
          className="block rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white hover:bg-slate-800"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
