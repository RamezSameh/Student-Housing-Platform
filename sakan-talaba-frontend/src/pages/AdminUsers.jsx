import { useEffect, useState } from "react";
import { getAdminUsers, promoteToAdmin, demoteFromAdmin, createOwner, deleteUser } from "../services/adminService";
import { getApiError } from "../services/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [email, setEmail] = useState("");
  const [ownerForm, setOwnerForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true); setError("");
    try { setUsers(await getAdminUsers()); }
    catch (e) { setError(getApiError(e, "Could not load users.")); }
    finally { setLoading(false); }
  };
  useEffect(() => { load(); }, []);

  const changeRole = async (action, targetEmail) => {
    setBusy(targetEmail);
    try {
      if (action === "promote") await promoteToAdmin(targetEmail);
      else await demoteFromAdmin(targetEmail);
      await load();
    } catch (e) { alert(getApiError(e)); }
    finally { setBusy(""); }
  };

  const submitOwner = async (event) => {
    event.preventDefault();
    setBusy("create-owner");
    setError("");
    try {
      await createOwner(ownerForm);
      setOwnerForm({ firstName: "", lastName: "", email: "", password: "" });
      await load();
    } catch (e) {
      setError(getApiError(e, "Could not create owner account."));
    } finally {
      setBusy("");
    }
  };

  const removeUser = async (user) => {
    if (!window.confirm(`Delete ${user.email}?`)) return;
    setBusy(user.email);
    try {
      await deleteUser(user.userId);
      await load();
    } catch (e) { setError(getApiError(e, "Could not delete user.")); }
    finally { setBusy(""); }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} onRetry={load} />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">User Management</h1>
      <form onSubmit={submitOwner} className="mb-6 rounded-2xl border bg-white p-5">
        <h2 className="mb-3 font-semibold">Create owner account</h2>
        <div className="grid gap-3 md:grid-cols-4">
          <input required placeholder="First name" value={ownerForm.firstName} onChange={e => setOwnerForm({ ...ownerForm, firstName: e.target.value })} className="rounded-lg border px-4 py-3" />
          <input required placeholder="Last name" value={ownerForm.lastName} onChange={e => setOwnerForm({ ...ownerForm, lastName: e.target.value })} className="rounded-lg border px-4 py-3" />
          <input required type="email" placeholder="Owner email" value={ownerForm.email} onChange={e => setOwnerForm({ ...ownerForm, email: e.target.value })} className="rounded-lg border px-4 py-3" />
          <input required minLength={6} type="password" placeholder="Temporary password" value={ownerForm.password} onChange={e => setOwnerForm({ ...ownerForm, password: e.target.value })} className="rounded-lg border px-4 py-3" />
        </div>
        <button disabled={busy === "create-owner"} className="mt-3 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">Create owner</button>
      </form>
      <div className="mb-6 flex gap-2">
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="User email" className="flex-1 rounded-lg border px-4 py-3" />
        <button disabled={!email || !!busy} onClick={() => changeRole("promote", email)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">
          Promote
        </button>
      </div>

      <div className="overflow-x-auto rounded-2xl border bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-slate-50 text-left">
            <tr><th className="p-4">Name</th><th className="p-4">Email</th><th className="p-4">Roles</th><th className="p-4">Action</th></tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const admin = u.roles?.some(r => r.toLowerCase() === "admin");
              return (
                <tr key={u.userId} className="border-t">
                  <td className="p-4">{u.firstName} {u.lastName}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">{u.roles?.join(", ")}</td>
                  <td className="p-4">
                    {!admin && <button disabled={busy === u.email} onClick={() => removeUser(u)} className="mr-2 rounded-lg border border-red-200 px-3 py-2 text-red-600 disabled:opacity-50">Delete</button>}
                    {admin ? (
                      <button disabled={busy === u.email} onClick={() => changeRole("demote", u.email)} className="rounded-lg border border-red-200 px-3 py-2 text-red-600 disabled:opacity-50">
                        Demote
                      </button>
                    ) : (
                      <button disabled={busy === u.email} onClick={() => changeRole("promote", u.email)} className="rounded-lg border px-3 py-2 disabled:opacity-50">
                        Promote
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
