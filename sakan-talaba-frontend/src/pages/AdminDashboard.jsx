import { useEffect, useState } from "react";
import { getDashboard } from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getApiError } from "../services/api";

const cards = [
  ["Total users", "totalUsers"], ["Students", "totalStudents"], ["Owners", "totalOwners"],
  ["Universities", "totalUniversities"], ["Housing", "totalHousing"], ["Verified housing", "verifiedHousing"],
  ["Pending housing", "pendingHousing"], ["Bookings", "totalBookings"], ["Pending bookings", "pendingBookings"],
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true); setError("");
    try { setData(await getDashboard()); }
    catch (e) { setError(getApiError(e, "Could not load admin dashboard.")); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Admin Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, key]) => (
          <div key={key} className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{data?.[key] ?? 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
