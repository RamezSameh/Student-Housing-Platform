import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await login(form);
      const destination =
        data.roles?.some((r) => r.toLowerCase() === "admin")
          ? "/admin"
          : location.state?.from || "/";
      navigate(destination, { replace: true });
    } catch (err) {
      setError(getApiError(err, "Invalid email or password."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-700 px-4 py-16">
      <div className="pointer-events-none absolute right-0 top-0 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="relative mx-auto max-w-md rounded-3xl border border-white/20 bg-white/95 p-6 shadow-2xl backdrop-blur sm:p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-blue-600">Welcome back</p>
        <h1 className="mt-2 text-3xl font-extrabold text-slate-900">Login to Sakan Talaba</h1>
        <p className="mt-1 text-sm text-slate-500">Sign in to manage your housing.</p>

        {error && <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

        <form onSubmit={submit} className="mt-6 space-y-4">
          <input
            type="email" required placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
          />
          <input
            type={showPassword ? "text" : "password"} required placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border px-4 py-3 pr-12 outline-none focus:ring-2 focus:ring-slate-300"
          />
          <button type="button" onClick={() => setShowPassword((value) => !value)} className="relative -mt-12 ml-auto mr-3 flex h-10 items-center text-slate-500" aria-label="Toggle password visibility">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          <button disabled={loading} className="w-full rounded-lg bg-slate-900 px-4 py-3 font-medium text-white disabled:opacity-50">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="font-semibold text-slate-900">Register</Link>
        </p>
      </div>
    </div>
  );
}
