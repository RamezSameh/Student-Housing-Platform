import { NavLink, Outlet } from "react-router-dom";

export default function Admin() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex flex-wrap gap-2">
        <NavLink to="/admin" end className="rounded-lg border px-4 py-2 text-sm">Dashboard</NavLink>
        <NavLink to="/admin/users" className="rounded-lg border px-4 py-2 text-sm">Users</NavLink>
        <NavLink to="/admin/inbox" className="rounded-lg border px-4 py-2 text-sm">Inbox</NavLink>
      </div>
      <Outlet />
    </div>
  );
}
