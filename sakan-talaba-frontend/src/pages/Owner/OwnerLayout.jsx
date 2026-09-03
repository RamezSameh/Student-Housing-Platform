import { NavLink, Outlet } from "react-router-dom";
import { Building2, CalendarClock, LayoutDashboard } from "lucide-react";

const tabClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition ${
    isActive
      ? "border-blue-600 bg-blue-50 text-blue-700"
      : "border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
  }`;

export default function OwnerLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-slate-900">Owner Dashboard</h1>
      <p className="mb-6 text-sm text-slate-500">Manage your listings and bookings.</p>

      <div className="mb-6 flex flex-wrap gap-2">
        <NavLink to="/owner" end className={tabClass}>
          <LayoutDashboard size={16} />
          Dashboard
        </NavLink>
        <NavLink to="/owner/housings" className={tabClass}>
          <Building2 size={16} />
          My Housings
        </NavLink>
        <NavLink to="/owner/bookings" className={tabClass}>
          <CalendarClock size={16} />
          Bookings
        </NavLink>
      </div>

      <Outlet />
    </div>
  );
}
