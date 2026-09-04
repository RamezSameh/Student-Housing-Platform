import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", password: "", nationalId: "", universityId: "", university: "", mobile: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-4 py-12">
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
      <div className="relative mx-auto max-w-2xl rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Sakan Talaba</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Create your student account</h1>
        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="First name" value={form.firstName} onChange={e => setForm({...form, firstName:e.target.value})} className="rounded-lg border px-4 py-3" />
            <input required placeholder="Last name" value={form.lastName} onChange={e => setForm({...form, lastName:e.target.value})} className="rounded-lg border px-4 py-3" />
          </div>
          <input required type="email" placeholder="Email" value={form.email} onChange={e => setForm({...form, email:e.target.value})} className="w-full rounded-lg border px-4 py-3" />
          <div className="relative">
            <input required minLength={6} type={showPassword ? "text" : "password"} placeholder="Password (6+ chars)" value={form.password} onChange={e => setForm({...form, password:e.target.value})} className="w-full rounded-lg border px-4 py-3 pr-12" />
            <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label="Toggle password visibility">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <input required placeholder="National ID" value={form.nationalId} onChange={e => setForm({...form, nationalId:e.target.value})} className="rounded-lg border px-4 py-3" />
            <input required placeholder="Mobile number" value={form.mobile} onChange={e => setForm({...form, mobile:e.target.value})} className="rounded-lg border px-4 py-3" />
            <input required placeholder="University" value={form.university} onChange={e => setForm({...form, university:e.target.value})} className="rounded-lg border px-4 py-3" />
            <input placeholder="University ID (optional)" value={form.universityId} onChange={e => setForm({...form, universityId:e.target.value})} className="rounded-lg border px-4 py-3" />
          </div>
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
