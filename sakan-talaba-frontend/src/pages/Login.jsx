import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getApiError } from "../services/api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-slate-900">Login</h1>
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
            type="password" required placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-slate-300"
          />
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
