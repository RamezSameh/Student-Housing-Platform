import { useEffect, useState } from "react";
import { CalendarDays } from "lucide-react";
import { getMyBookings } from "../services/bookingService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getApiError } from "../services/api";

const statusClass = (status) => {
  const s = String(status || "").toLowerCase();
  if (s.includes("confirm") || s.includes("success")) return "bg-emerald-100 text-emerald-700";
  if (s.includes("fail") || s.includes("cancel")) return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { setBookings(await getMyBookings()); }
    catch (e) { setError(getApiError(e, "Could not load bookings.")); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner text="Loading bookings..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center gap-2">
        <CalendarDays />
        <h1 className="text-2xl font-bold">My Bookings</h1>
      </div>

      {!bookings.length ? (
        <div className="rounded-2xl border bg-white p-12 text-center text-slate-500">
          No bookings yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((b) => (
            <div key={b.bookingId} className="rounded-2xl border bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row">
                <div>
                  <h2 className="font-semibold">Booking #{b.bookingId}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Room {b.roomNumber || "-"} · Floor {b.floor ?? "-"} · {b.roomTypeName || "-"}
                  </p>
                </div>
                <span className={`h-fit rounded-full px-3 py-1 text-xs font-semibold ${statusClass(b.status)}`}>
                  {b.status || "Pending"}
                </span>
              </div>
              <div className="mt-4 grid gap-3 text-sm sm:grid-cols-4">
                <div><span className="text-slate-500">Check in</span><p className="font-medium">{new Date(b.checkInDate).toLocaleDateString()}</p></div>
                <div><span className="text-slate-500">Check out</span><p className="font-medium">{new Date(b.checkOutDate).toLocaleDateString()}</p></div>
                <div><span className="text-slate-500">Total</span><p className="font-medium">{Number(b.totalCost || 0).toLocaleString()} EGP</p></div>
                <div><span className="text-slate-500">Payment</span><p className="font-medium">{b.paymentStatus || "Pending"}</p></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
