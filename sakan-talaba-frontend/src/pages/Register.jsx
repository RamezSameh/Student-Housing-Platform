import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(form);
      navigate("/");
    } catch (err) {
      setError(getApiError(err, "Could not create the account."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Create account</h1>
        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="First name" value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} className="rounded-lg border px-4 py-3" />
            <input required placeholder="Last name" value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} className="rounded-lg border px-4 py-3" />
          </div>
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="w-full rounded-lg border px-4 py-3" />
          <input required minLength={6} type="password" placeholder="Password (6+ chars)" value={form.password} onChange={e => setForm({...form, password:e.target.value})} className="w-full rounded-lg border px-4 py-3" />
          <button disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white disabled:opacity-50">
            {loading ? "Creating..." : "Register"}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">
          Already have an account? <Link to="/login" className="font-semibold text-slate-900">Login</Link>
        </p>
      </div>
    </div>
  );
}
