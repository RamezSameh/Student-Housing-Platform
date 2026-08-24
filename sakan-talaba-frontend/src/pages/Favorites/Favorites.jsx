import { useEffect, useState } from "react";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import HousingCard from "../../components/housing/HousingCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { useFavorites } from "../../context/FavoritesContext";
import { getHousingById } from "../../services/housingService";
import { getApiError } from "../../services/api";

function Favorites() {
  const navigate = useNavigate();
  const { favoriteIds, loading: idsLoading, refresh } = useFavorites();

  const [housings, setHousings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadHousings = async () => {
      setLoading(true);
      setError("");

      try {
        const results = await Promise.all(
          favoriteIds.map(async (id) => {
            try {
              const result = await getHousingById(id);
              return result?.data ?? result;
            } catch {
              // A favorited housing might have been removed since; skip it quietly.
              return null;
            }
          })
        );

        if (!cancelled) {
          setHousings(results.filter(Boolean));
        }
      } catch (err) {
        if (!cancelled) setError(getApiError(err, "Could not load your favorites."));
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    if (!idsLoading) {
      if (favoriteIds.length === 0) {
        setHousings([]);
        setLoading(false);
      } else {
        loadHousings();
      }
    }

    return () => {
      cancelled = true;
    };
  }, [favoriteIds, idsLoading]);

  const showLoading = idsLoading || loading;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <section className="bg-slate-950">
        <div className="mx-auto max-w-7xl px-6 py-14">
          <p className="font-semibold text-blue-400">SAVED HOMES</p>
          <h1 className="mt-2 text-4xl font-extrabold text-white">My Favorites</h1>
          <p className="mt-3 text-slate-300">Keep track of the housing options you like.</p>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-6 py-10">
        {showLoading && <LoadingSpinner text="Loading your favorites..." />}

        {!showLoading && error && (
          <ErrorMessage message={error} onRetry={refresh} />
        )}

        {!showLoading && !error && (
          <>
            {/* Toolbar */}
            <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                  <Heart size={22} className="fill-current" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{housings.length} Saved</p>
                  <p className="text-sm text-slate-500">Housing options</p>
                </div>
              </div>
            </div>

            {housings.length === 0 && (
              <div className="rounded-2xl bg-white p-14 text-center shadow-sm">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
                  <Heart size={36} />
                </div>
                <h2 className="mt-6 text-2xl font-bold text-slate-900">No Favorites Yet</h2>
                <p className="mx-auto mt-2 max-w-md text-slate-500">
                  Start browsing housing and save the options you like.
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/housing")}
                  className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                >
                  Browse Housing
                </button>
              </div>
            )}

            {housings.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {housings.map((housing) => (
                  <HousingCard key={housing.id ?? housing.housingId} housing={housing} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default Favorites;
