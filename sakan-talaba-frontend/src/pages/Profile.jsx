import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";
import { updateMe } from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "" });
    setLoading(false);
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      await updateMe({
        firstName: form.firstName,
        lastName: form.lastName,
      });
      await refreshUser();
      setMessage("Profile updated successfully.");
    } catch (e) {
      setError(getApiError(e, "Could not update profile."));
    } finally { setSaving(false); }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">My Profile</h1>
        {message && <div className="mt-4 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700">{message}</div>}
        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={save} className="mt-6 space-y-4">
          <input value={form.email} disabled className="w-full rounded-lg border bg-slate-50 px-4 py-3 text-slate-500" />
          <div className="grid gap-4 sm:grid-cols-2">
            <input required value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} className="rounded-lg border px-4 py-3" placeholder="First name" />
            <input required value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} className="rounded-lg border px-4 py-3" placeholder="Last name" />
          </div>
          <button disabled={saving} className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
