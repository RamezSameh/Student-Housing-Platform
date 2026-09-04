import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Heart,
  User,
  CalendarDays,
  Menu,
  X,
  LogOut,
  Shield,
  ChevronDown,
  Search,
  Building2,
  Phone,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useFavorites } from "../../context/FavoritesContext";
import NotificationBell from "./NotificationBell";

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 font-medium transition ${
    isActive ? "text-blue-600" : "text-slate-700 hover:text-blue-600"
  }`;

const mobileNavLinkClass = ({ isActive }) =>
  `flex items-center gap-3 rounded-xl px-4 py-3 font-medium transition ${
    isActive ? "bg-blue-50 text-blue-600" : "text-slate-700 hover:bg-slate-50"
  }`;

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, isOwner, logout } = useAuth();
  const favorites = useFavorites();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  // Close the account dropdown whenever we navigate or the route changes.
  useEffect(() => {
    const closeOnClickAway = () => setAccountMenuOpen(false);
    window.addEventListener("click", closeOnClickAway);
    return () => window.removeEventListener("click", closeOnClickAway);
  }, []);

  const handleLogout = () => {
    logout();
    setAccountMenuOpen(false);
    closeMobileMenu();
    navigate("/");
  };

  const favoritesCount = isAuthenticated ? favorites?.count ?? 0 : 0;
  const initials =
    (user?.firstName?.[0] || "") + (user?.lastName?.[0] || "") || user?.email?.[0]?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      {/* Main bar */}
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        {/* Logo */}
        <Link to="/" onClick={closeMobileMenu} className="flex shrink-0 items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
            <Home size={22} />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-900">Sakan Talaba</h1>
            <p className="hidden text-xs text-slate-500 sm:block">Student Housing</p>
          </div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-6 lg:flex">
          <NavLink to="/" end className={navLinkClass}>
            Home
          </NavLink>
          {isAuthenticated && <NavLink to="/housing" className={navLinkClass}>
            <Search size={17} />
            Find Housing
          </NavLink>}
          {isAuthenticated && (
            <NavLink to="/my-bookings" className={navLinkClass}>
              <CalendarDays size={18} />
              My Bookings
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass}>
              <Shield size={18} />
              Admin
            </NavLink>
          )}
          {isOwner && (
            <NavLink to="/owner" className={navLinkClass}>
              <Building2 size={18} />
              Owner Dashboard
            </NavLink>
          )}
          {isAuthenticated && <NavLink to={isAdmin ? "/admin/inbox" : "/contact"} className={navLinkClass}>
            <Phone size={17} />
            {isAdmin ? "Inbox" : "Contact Us"}
          </NavLink>}
        </div>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 lg:flex">
          <NavLink
            to="/favorites"
            title="Favorites"
            className={({ isActive }) =>
              `relative flex items-center gap-2 rounded-lg p-2 transition ${
                isActive ? "bg-red-50 text-red-500" : "text-slate-600 hover:bg-slate-100 hover:text-red-500"
              }`
            }
          >
            <Heart size={19} />
            <span className="hidden xl:inline">Favorites</span>
            {favoritesCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                {favoritesCount}
              </span>
            )}
          </NavLink>

          {isAuthenticated && <NotificationBell />}

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 font-medium text-slate-700 transition hover:border-blue-600 hover:text-blue-600"
              >
                <User size={18} />
                <span className="hidden xl:inline">Login</span>
              </Link>
              <Link
                to="/register"
                className="hidden rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 xl:block"
              >
                Register
              </Link>
            </>
          ) : (
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={() => setAccountMenuOpen((v) => !v)}
                className="flex items-center gap-2 rounded-lg border border-slate-200 px-2 py-1.5 pr-3 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {initials}
                </span>
                <span className="hidden max-w-[110px] truncate xl:inline">
                  {user?.firstName || user?.email}
                </span>
                <ChevronDown size={16} />
              </button>

              {accountMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-slate-200 bg-white py-1 shadow-lg">
                  <div className="border-b border-slate-100 px-4 py-3">
                    <p className="truncate text-sm font-semibold text-slate-900">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <Link
                    to="/my-bookings"
                    onClick={() => setAccountMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                  >
                    <CalendarDays size={16} />
                    My Bookings
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Shield size={16} />
                      Admin Panel
                    </Link>
                  )}
                  {isOwner && (
                    <Link
                      to="/owner"
                      onClick={() => setAccountMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      <Building2 size={16} />
                      Owner Dashboard
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 border-t border-slate-100 px-4 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 transition hover:bg-slate-100 lg:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            <NavLink to="/" end onClick={closeMobileMenu} className={mobileNavLinkClass}>
              <Home size={19} />
              Home
            </NavLink>

            {isAuthenticated && <NavLink to="/housing" onClick={closeMobileMenu} className={mobileNavLinkClass}>
              <Search size={19} />
              Find Housing
            </NavLink>}

            <NavLink to="/favorites" onClick={closeMobileMenu} className={mobileNavLinkClass}>
              <Heart size={19} />
              Favorites
              {favoritesCount > 0 && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[11px] font-bold text-white">
                  {favoritesCount}
                </span>
              )}
            </NavLink>

            {isAuthenticated && <NavLink to={isAdmin ? "/admin/inbox" : "/contact"} onClick={closeMobileMenu} className={mobileNavLinkClass}>
              <Phone size={19} />
              {isAdmin ? "Inbox" : "Contact Us"}
            </NavLink>}

            {isAuthenticated && (
              <>
                <NavLink to="/my-bookings" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  <CalendarDays size={19} />
                  My Bookings
                </NavLink>
                <NavLink to="/profile" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                  <User size={19} />
                  My Profile
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                    <Shield size={19} />
                    Admin Panel
                  </NavLink>
                )}
                {isOwner && (
                  <NavLink to="/owner" onClick={closeMobileMenu} className={mobileNavLinkClass}>
                    <Building2 size={19} />
                    Owner Dashboard
                  </NavLink>
                )}
              </>
            )}

            <div className="my-2 border-t border-slate-100" />

            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 rounded-xl px-4 py-3 font-medium text-slate-700 transition hover:bg-slate-50"
                >
                  <User size={19} />
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={closeMobileMenu}
                  className="flex items-center justify-center rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700"
                >
                  Register
                </Link>
              </>
            ) : (
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl px-4 py-3 font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={19} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
