import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getOwnerDashboard } from "../../services/ownerService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { getApiError } from "../../services/api";

const cards = [
  ["Total housings", "totalHousings"],
  ["Verified", "verifiedHousings"],
  ["Pending verification", "pendingHousings"],
  ["Total rooms", "totalRooms"],
  ["Available rooms", "availableRooms"],
  ["Total bookings", "totalBookings"],
  ["Pending bookings", "pendingBookings"],
  ["Confirmed bookings", "confirmedBookings"],
  ["Cancelled bookings", "cancelledBookings"],
];

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getOwnerDashboard());
    } catch (e) {
      setError(getApiError(e, "Could not load your dashboard."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner text="Loading your dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div>
      {data?.totalHousings === 0 && (
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50 p-5 text-blue-800">
          You haven't listed any housing yet.{" "}
          <Link to="/owner/housings/new" className="font-semibold underline">
            Create your first listing
          </Link>
          .
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, key]) => (
          <div key={key} className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{data?.[key] ?? 0}</p>
          </div>
        ))}

        <div className="rounded-2xl border bg-emerald-50 p-5 shadow-sm sm:col-span-2 lg:col-span-3">
          <p className="text-sm text-emerald-700">Total revenue (from confirmed payments)</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">
            {Number(data?.totalRevenue ?? 0).toLocaleString()} EGP
          </p>
        </div>
      </div>
    </div>
  );
}
