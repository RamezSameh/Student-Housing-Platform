import { useEffect, useState } from "react";
import { Info } from "lucide-react";
import { getDashboardStats } from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getApiError } from "../services/api";

const cards = [
  ["Total users", "totalUsers"],
  ["Students", "totalStudents"],
  ["Owners", "totalOwners"],
  ["Admins", "totalAdmins"],
  ["Universities", "totalUniversities"],
  ["Housing types", "totalHousingTypes"],
  ["Total housing", "totalHousing"],
  ["Verified housing", "verifiedHousing"],
  ["Pending housing", "pendingHousing"],
];

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setData(await getDashboardStats());
    } catch (e) {
      setError(getApiError(e, "Could not load admin dashboard."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

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

      <div className="mt-6 flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <Info size={18} className="mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p>
            "Verified" and "pending" housing counts are based on the most recent{" "}
            {data?.sampledHousing ?? 0} listings returned by the search API, not the full
            dataset — the backend doesn't currently expose a dedicated verification-count
            endpoint.
          </p>
          <p>
            A platform-wide bookings summary isn't shown here yet: the backend's
            <code className="mx-1 rounded bg-blue-100 px-1 py-0.5">/api/Admin/bookings</code>
            endpoint currently returns only the logged-in admin's own bookings rather than
            every user's, so a "total bookings" figure here would be misleading.
          </p>
        </div>
      </div>
    </div>
  );
}
