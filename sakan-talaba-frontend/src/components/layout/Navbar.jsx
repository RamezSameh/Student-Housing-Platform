import { Link } from "react-router-dom";
import { Home, Search, Heart, User } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Home size={22} />
          </div>

          <div>
            <h1 className="text-lg font-bold text-slate-900">
              Sakan Talaba
            </h1>
            <p className="text-xs text-slate-500">
              Student Housing
            </p>
          </div>
        </Link>

        {/* Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          <Link
            to="/"
            className="font-medium text-slate-700 transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/housing"
            className="font-medium text-slate-700 transition hover:text-blue-600"
          >
            Find Housing
          </Link>

          <Link
            to="/universities"
            className="font-medium text-slate-700 transition hover:text-blue-600"
          >
            Universities
          </Link>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">

          <Link
            to="/favorites"
            className="hidden rounded-lg p-2 text-slate-600 hover:bg-slate-100 hover:text-red-500 sm:block"
          >
            <Heart size={20} />
          </Link>

          <Link
            to="/login"
            className="flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
          >
            <User size={18} />
            <span>Login</span>
          </Link>

          <Link
            to="/register"
            className="hidden rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 sm:block"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
  );
}

export default Navbar;