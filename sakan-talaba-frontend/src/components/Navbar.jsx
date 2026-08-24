import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { CalendarDays, Heart, Home, Menu, Shield, User, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive ? "bg-slate-100 text-slate-900" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
  }`;

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const close = () => setOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={close} className="text-xl font-bold text-slate-900">
          Sakan Talaba
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          <NavLink to="/" className={navClass}><Home size={18} /> Home</NavLink>
          <NavLink to="/housing" className={navClass}><Home size={18} /> Housing</NavLink>
          {isAuthenticated && (
            <>
              <NavLink to="/favorites" className={navClass}><Heart size={18} /> Favorites</NavLink>
              <NavLink to="/bookings" className={navClass}><CalendarDays size={18} /> Bookings</NavLink>
              <NavLink to="/profile" className={navClass}><User size={18} /> Profile</NavLink>
            </>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navClass}><Shield size={18} /> Admin</NavLink>
          )}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <span className="max-w-32 truncate text-sm text-slate-600">
                {user?.firstName || user?.email}
              </span>
              <button onClick={logout} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                Login
              </Link>
              <Link to="/register" className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                Register
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X size={23} /> : <Menu size={23} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-1">
            <NavLink onClick={close} to="/" className={navClass}><Home size={18} /> Home</NavLink>
            <NavLink onClick={close} to="/housing" className={navClass}><Home size={18} /> Housing</NavLink>
            {isAuthenticated && (
              <>
                <NavLink onClick={close} to="/favorites" className={navClass}><Heart size={18} /> Favorites</NavLink>
                <NavLink onClick={close} to="/bookings" className={navClass}><CalendarDays size={18} /> Bookings</NavLink>
                <NavLink onClick={close} to="/profile" className={navClass}><User size={18} /> Profile</NavLink>
              </>
            )}
            {isAdmin && <NavLink onClick={close} to="/admin" className={navClass}><Shield size={18} /> Admin</NavLink>}

            <div className="mt-2 border-t pt-2">
              {isAuthenticated ? (
                <button onClick={() => { logout(); close(); }} className="w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white">
                  Logout
                </button>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link onClick={close} to="/login" className="rounded-lg border px-4 py-2 text-center text-sm font-medium">Login</Link>
                  <Link onClick={close} to="/register" className="rounded-lg bg-slate-900 px-4 py-2 text-center text-sm font-medium text-white">Register</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
