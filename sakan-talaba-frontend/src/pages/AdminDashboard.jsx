import { useEffect, useState } from "react";
import { ShieldCheck, MapPin } from "lucide-react";
import {
  getDashboardStats,
  getPendingHousings,
  setHousingVerified,
  getContactMessages,
  markContactMessageRead,
} from "../services/adminService";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { getApiError } from "../services/api";

const cards = [
  ["Total users", "totalUsers"],
  ["Students", "totalStudents"],
  ["Owners", "totalOwners"],
  ["Universities", "totalUniversities"],
  ["Total housing", "totalHousing"],
  ["Verified housing", "verifiedHousing"],
  ["Pending housing", "pendingHousing"],
  ["Total bookings", "totalBookings"],
  ["Pending bookings", "pendingBookings"],
  ["Confirmed bookings", "confirmedBookings"],
  ["Cancelled bookings", "cancelledBookings"],
  ["Unread contacts", "unreadContactMessages"],
];

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [pending, setPending] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [messages, setMessages] = useState([]);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, pendingRes, messagesRes] = await Promise.all([
        getDashboardStats(),
        getPendingHousings(),
        getContactMessages(),
      ]);
      setStats(statsRes);
      setPending(Array.isArray(pendingRes) ? pendingRes : []);
      setMessages(Array.isArray(messagesRes) ? messagesRes : []);
    } catch (e) {
      setError(getApiError(e, "Could not load admin dashboard."));
    } finally {
      setLoading(false);
    }
  };

  const handleRead = async (id) => {
    await markContactMessageRead(id);
    setMessages((prev) => prev.map((message) =>
      message.id === id ? { ...message, isRead: true } : message
    ));
  };

  useEffect(() => {
    load();
  }, []);

  const handleVerify = async (id, verify) => {
    setBusyId(id);
    try {
      await setHousingVerified(id, verify);
      setPending((prev) => prev.filter((h) => h.id !== id));
      setStats((prev) =>
        prev
          ? {
              ...prev,
              verifiedHousing: verify ? prev.verifiedHousing + 1 : prev.verifiedHousing,
              pendingHousing: Math.max(prev.pendingHousing - 1, 0),
            }
          : prev
      );
    } catch (e) {
      alert(getApiError(e, "Could not update verification status."));
    } finally {
      setBusyId(null);
    }
  };

  if (loading) return <LoadingSpinner text="Loading admin dashboard..." />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, key]) => (
          <div key={key} className="rounded-2xl border bg-white p-5 shadow-sm">
            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats?.[key] ?? 0}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 rounded-2xl border bg-white p-5 shadow-sm">
        <p className="text-sm text-slate-500">Collected payments</p>
        <p className="mt-2 text-3xl font-bold text-emerald-700">
          {Number(stats?.totalRevenue ?? 0).toLocaleString()} EGP
        </p>
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-lg font-bold text-slate-900">
          Pending verification ({pending.length})
        </h2>

        {pending.length === 0 ? (
          <div className="rounded-2xl border bg-white p-8 text-center text-slate-500">
            No housings waiting for verification.
          </div>

        ) : (
          <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Housing</th>
                  <th className="px-4 py-3">Owner</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Listed</th>
                  <th className="px-4 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pending.map((h) => (
                  <tr key={h.id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{h.title}</div>
                      <div className="flex items-center gap-1 text-xs text-slate-500">
                        <MapPin size={12} />
                        {h.city}
                      </div>

                      <div className="mt-8">
                        <h2 className="mb-3 text-lg font-bold text-slate-900">
                          Contact inbox ({messages.filter((message) => !message.isRead).length} unread)
                        </h2>
                        <div className="overflow-x-auto rounded-2xl border bg-white shadow-sm">
                          {messages.length === 0 ? (
                            <div className="p-8 text-center text-slate-500">No contact messages.</div>
                          ) : (
                            <table className="w-full min-w-[720px] text-left text-sm">
                              <thead className="border-b bg-slate-50 text-xs uppercase text-slate-500">
                                <tr><th className="px-4 py-3">Sender</th><th className="px-4 py-3">Subject</th><th className="px-4 py-3">Message</th><th className="px-4 py-3">Action</th></tr>
                              </thead>
                              <tbody className="divide-y">
                                {messages.map((message) => (
                                  <tr key={message.id} className={message.isRead ? "" : "bg-blue-50/40"}>
                                    <td className="px-4 py-3"><div className="font-medium">{message.name}</div><div className="text-xs text-slate-500">{message.email}</div></td>
                                    <td className="px-4 py-3">{message.subject || "—"}</td>
                                    <td className="max-w-md px-4 py-3 text-slate-600">{message.message}</td>
                                    <td className="px-4 py-3">{message.isRead ? <span className="text-xs text-slate-400">Read</span> : <button type="button" onClick={() => handleRead(message.id)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700">Mark read</button>}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-900">{h.ownerName}</div>
                      <div className="text-xs text-slate-500">{h.ownerEmail}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {Number(h.price).toLocaleString()} EGP
                    </td>
                    <td className="px-4 py-3 text-slate-500">
                      {new Date(h.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        disabled={busyId === h.id}
                        onClick={() => handleVerify(h.id, true)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                      >
                        <ShieldCheck size={14} />
                        Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
