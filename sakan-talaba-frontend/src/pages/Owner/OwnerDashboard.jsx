import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Building2 } from "lucide-react";
import { getOwnerDashboard, getMyHousings, getMyHousingBookings } from "../../services/ownerService";
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
  const [housings, setHousings] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashboard, housingData, bookingData] = await Promise.all([
        getOwnerDashboard(),
        getMyHousings(),
        getMyHousingBookings(),
      ]);
      setData(dashboard);
      setHousings(Array.isArray(housingData) ? housingData : []);
      setBookings(Array.isArray(bookingData) ? bookingData : []);
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

  const getDetails = (key) => {
    if (key === "totalHousings" || key === "verifiedHousings" || key === "pendingHousings") {
      return key === "verifiedHousings"
        ? housings.filter((housing) => housing.isVerified)
        : key === "pendingHousings"
          ? housings.filter((housing) => !housing.isVerified)
          : housings;
    }
    if (key === "totalRooms" || key === "availableRooms") return housings;
    if (key === "totalBookings") return bookings;

    const status = key.replace("Bookings", "").toLowerCase();
    return bookings.filter((booking) => booking.status?.toLowerCase() === status);
  };

  const renderDetails = () => {
    if (!selectedCard) return null;
    const details = getDetails(selectedCard.key);
    const bookingDetails = selectedCard.key.toLowerCase().includes("booking");

    return (
      <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">{selectedCard.label} details</h2>
            <p className="text-sm text-slate-500">{details.length} record(s)</p>
          </div>
          <button type="button" onClick={() => setSelectedCard(null)} className="rounded-lg border px-3 py-1.5 text-sm">
            Close
          </button>
        </div>

        {details.length === 0 ? (
          <p className="rounded-xl bg-slate-50 p-5 text-center text-slate-500">No details available.</p>
        ) : bookingDetails ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-3 py-3">Student</th>
                  <th className="px-3 py-3">Housing</th>
                  <th className="px-3 py-3">Dates</th>
                  <th className="px-3 py-3">Amount</th>
                  <th className="px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {details.map((booking) => (
                  <tr key={booking.bookingId}>
                    <td className="px-3 py-3">
                      <div className="font-medium">{booking.studentName || "—"}</div>
                      <div className="text-xs text-slate-500">{booking.studentEmail || "—"}</div>
                    </td>
                    <td className="px-3 py-3">{booking.housingTitle || "—"}<div className="text-xs text-slate-500">{booking.roomType || "—"}</div></td>
                    <td className="px-3 py-3 text-slate-600">{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</td>
                    <td className="px-3 py-3">{Number(booking.totalAmount || 0).toLocaleString()} EGP</td>
                    <td className="px-3 py-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">{booking.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {details.map((housing) => (
              <div key={housing.id} className="rounded-xl border p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">{housing.title}</p>
                    <p className="text-sm text-slate-500">{housing.city || "—"}</p>
                  </div>
                  <Building2 size={18} className="text-blue-600" />
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-slate-600">
                  <span>Rooms: {housing.roomCount ?? "—"}</span>
                  <span>Bookings: {housing.bookingCount ?? "—"}</span>
                  <span>Price: {Number(housing.price || 0).toLocaleString()} EGP</span>
                  <span>{housing.isVerified ? "Verified" : "Pending verification"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    );
  };

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
          <button
            type="button"
            key={key}
            onClick={() => setSelectedCard({ label, key })}
            className={`rounded-2xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-400 hover:shadow-md ${selectedCard?.key === key ? "border-blue-500 ring-2 ring-blue-100" : ""}`}
          >
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{data?.[key] ?? 0}</p>
            <p className="mt-2 text-xs text-blue-600">View details</p>
          </button>
        ))}

        <button
          type="button"
          onClick={() => setSelectedCard({ label: "Total revenue", key: "totalRevenue" })}
          className="rounded-2xl border bg-emerald-50 p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-400 hover:shadow-md sm:col-span-2 lg:col-span-3"
        >
          <p className="text-sm text-emerald-700">Total revenue (from confirmed payments)</p>
          <p className="mt-2 text-3xl font-bold text-emerald-800">
            {Number(data?.totalRevenue ?? 0).toLocaleString()} EGP
          </p>
          <p className="mt-2 text-xs text-emerald-700">View payment-related bookings</p>
        </button>
      </div>
      {selectedCard?.key === "totalRevenue" ? (
        <section className="mt-6 rounded-2xl border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Revenue bookings</h2>
              <p className="text-sm text-slate-500">Bookings with completed payments</p>
            </div>
            <button type="button" onClick={() => setSelectedCard(null)} className="rounded-lg border px-3 py-1.5 text-sm">Close</button>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {bookings.filter((booking) => booking.paymentStatus?.toLowerCase() === "succeeded").map((booking) => (
              <div key={booking.bookingId} className="rounded-xl border p-4">
                <p className="font-semibold">{booking.studentName || "Student"}</p>
                <p className="text-sm text-slate-500">{booking.housingTitle || "Housing"} · {booking.status}</p>
                <p className="mt-2 font-bold text-emerald-700">{Number(booking.totalAmount || 0).toLocaleString()} EGP</p>
              </div>
            ))}
          </div>
        </section>
      ) : renderDetails()}
    </div>
  );
}
