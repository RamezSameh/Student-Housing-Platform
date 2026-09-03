import { useEffect, useState } from "react";
import { getMyHousingBookings } from "../../services/ownerService";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import { getApiError } from "../../services/api";

const statusStyles = {
  confirmed: "bg-green-50 text-green-700",
  pending: "bg-yellow-50 text-yellow-700",
  cancelled: "bg-red-50 text-red-700",
};

export default function OwnerBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getMyHousingBookings();
      setBookings(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(getApiError(e, "Could not load bookings."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <LoadingSpinner text="Loading bookings..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  if (bookings.length === 0) {
    return (
      <div className="rounded-2xl border bg-white p-10 text-center text-slate-500">
        No bookings yet on any of your housings.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
      <table className="w-full min-w-[720px] text-left text-sm">
        <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Housing</th>
            <th className="px-4 py-3">Student</th>
            <th className="px-4 py-3">Check-in</th>
            <th className="px-4 py-3">Check-out</th>
            <th className="px-4 py-3">Total</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Payment</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {bookings.map((b) => (
            <tr key={b.bookingId}>
              <td className="px-4 py-3 font-medium text-slate-900">{b.housingTitle || "—"}</td>
              <td className="px-4 py-3">
                <div className="text-slate-900">{b.studentName || "—"}</div>
                <div className="text-xs text-slate-500">{b.studentEmail}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(b.checkInDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-slate-600">
                {new Date(b.checkOutDate).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 font-medium text-slate-900">
                {Number(b.totalAmount).toLocaleString()} EGP
              </td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                    statusStyles[b.status?.toLowerCase()] || "bg-slate-100 text-slate-600"
                  }`}
                >
                  {b.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{b.paymentStatus}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
