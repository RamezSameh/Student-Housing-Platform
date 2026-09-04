import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";
import { updateMe, changePassword } from "../services/authService";
import LoadingSpinner from "../components/LoadingSpinner";

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", nationalId: "", universityId: "", university: "", mobile: "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) setForm({ firstName: user.firstName || "", lastName: user.lastName || "", email: user.email || "", nationalId: user.nationalId || "", universityId: user.universityId || "", university: user.university || "", mobile: user.mobile || "" });
    setLoading(false);
  }, [user]);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true); setError(""); setMessage("");
    try {
      await updateMe({
        firstName: form.firstName,
        lastName: form.lastName, nationalId: form.nationalId, universityId: form.universityId,
        university: form.university, mobile: form.mobile,
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
            <input value={form.nationalId} onChange={e => setForm({...form, nationalId:e.target.value})} className="rounded-lg border px-4 py-3" placeholder="National ID" />
            <input value={form.mobile} onChange={e => setForm({...form, mobile:e.target.value})} className="rounded-lg border px-4 py-3" placeholder="Mobile" />
            <input value={form.university} onChange={e => setForm({...form, university:e.target.value})} className="rounded-lg border px-4 py-3" placeholder="University" />
            <input value={form.universityId} onChange={e => setForm({...form, universityId:e.target.value})} className="rounded-lg border px-4 py-3" placeholder="University ID (optional)" />
          </div>
          <button disabled={saving} className="rounded-lg bg-slate-900 px-5 py-3 text-sm font-medium text-white disabled:opacity-50">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
        <form onSubmit={async (e) => { e.preventDefault(); setError(""); setMessage(""); try { await changePassword(passwords); setPasswords({ currentPassword: "", newPassword: "" }); setMessage("Password changed successfully."); } catch (e) { setError(getApiError(e, "Could not change password.")); } }} className="mt-8 space-y-4 border-t pt-6">
          <h2 className="text-lg font-bold">Change password</h2>
          <input required type="password" value={passwords.currentPassword} onChange={e => setPasswords({...passwords, currentPassword:e.target.value})} placeholder="Current password" className="w-full rounded-lg border px-4 py-3" />
          <input required minLength={6} type="password" value={passwords.newPassword} onChange={e => setPasswords({...passwords, newPassword:e.target.value})} placeholder="New password" className="w-full rounded-lg border px-4 py-3" />
          <button className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white">Change password</button>
        </form>
      </div>
    </div>
  );
}
