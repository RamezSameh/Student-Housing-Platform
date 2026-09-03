import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapPin, Plus, Star, Trash2, Pencil, ShieldCheck, ShieldAlert } from "lucide-react";
import { getMyHousings, deleteHousing } from "../../services/ownerService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { getApiError } from "../../services/api";

export default function OwnerHousings() {
  const [housings, setHousings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyHousings();
      setHousings(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(getApiError(e, "Could not load your housings."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"? This can't be undone.`)) return;
    setDeletingId(id);
    try {
      await deleteHousing(id);
      setHousings((prev) => prev.filter((h) => h.id !== id));
    } catch (e) {
      alert(getApiError(e, "Could not delete this housing."));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading your housings..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">{housings.length} listing(s)</p>
        <Link
          to="/owner/housings/new"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={16} />
          New Housing
        </Link>
      </div>

      {housings.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
          You haven't listed any housing yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {housings.map((h) => (
            <div key={h.id} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
              <div className="h-36 bg-slate-100">
                {h.primaryImageUrl ? (
                  <img src={h.primaryImageUrl} alt={h.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <MapPin size={24} />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="line-clamp-1 font-bold text-slate-900">{h.title}</h3>
                  {h.isVerified ? (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
                      <ShieldCheck size={13} />
                      Verified
                    </span>
                  ) : (
                    <span className="flex shrink-0 items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                      <ShieldAlert size={13} />
                      Pending
                    </span>
                  )}
                </div>

                <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
                  <MapPin size={14} />
                  {h.city}
                </p>

                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-semibold text-blue-600">
                    {Number(h.price).toLocaleString()} EGP/mo
                  </span>
                  <span className="flex items-center gap-1 text-slate-500">
                    <Star size={14} className="fill-yellow-400 text-yellow-400" />
                    {h.rating ? h.rating.toFixed(1) : "—"}
                  </span>
                </div>

                <div className="mt-2 flex gap-3 text-xs text-slate-500">
                  <span>{h.roomCount} room(s)</span>
                  <span>{h.bookingCount} booking(s)</span>
                  <span>{h.isAvailable ? "Available" : "Unavailable"}</span>
                </div>

                <div className="mt-4 flex gap-2">
                  <Link
                    to={`/owner/housings/${h.id}/edit`}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil size={14} />
                    Edit
                  </Link>
                  <button
                    type="button"
                    disabled={deletingId === h.id}
                    onClick={() => handleDelete(h.id, h.title)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
