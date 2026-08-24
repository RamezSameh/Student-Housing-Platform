import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { getFavorites, removeFavorite } from "../services/favoriteService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getApiError } from "../services/api";

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { setFavorites(await getFavorites()); }
    catch (e) { setError(getApiError(e, "Could not load favorites.")); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const remove = async (id) => {
    try {
      await removeFavorite(id);
      setFavorites((items) => items.filter((x) => x.housingId !== id));
    } catch (e) {
      alert(getApiError(e, "Could not remove favorite."));
    }
  };

  if (loading) return <LoadingSpinner text="Loading favorites..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <Heart className="fill-red-500 text-red-500" />
        <h1 className="text-2xl font-bold">My Favorites</h1>
      </div>

      {!favorites.length ? (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <Heart className="mx-auto text-slate-300" size={42} />
          <p className="mt-3 text-slate-500">You have no favorite housing yet.</p>
          <Link to="/housing" className="mt-5 inline-block rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
            Browse housing
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((fav) => (
            <div key={fav.housingId} className="rounded-2xl border bg-white p-5 shadow-sm">
              <p className="font-semibold">Housing #{fav.housingId}</p>
              <p className="mt-1 text-sm text-slate-500">
                Added {fav.createdAt ? new Date(fav.createdAt).toLocaleDateString() : ""}
              </p>
              <div className="mt-5 flex gap-2">
                <Link to={`/housing/${fav.housingId}`} className="flex-1 rounded-lg bg-slate-900 px-4 py-2 text-center text-sm text-white">
                  View
                </Link>
                <button onClick={() => remove(fav.housingId)} className="rounded-lg border p-2 text-red-600" title="Remove">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
