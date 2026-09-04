import { useEffect, useState } from "react";
import { Bell, CheckCheck } from "lucide-react";
import { getNotifications, markNotificationRead } from "../../services/notificationService";

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const unreadCount = items.filter((n) => !n.isRead).length;

  const load = async () => {
    try {
      const data = await getNotifications();
      setItems(data);
    } catch {
      // Silently ignore — a failed notification fetch shouldn't break the navbar.
    } finally {
      setLoaded(true);
    }
  };

  useEffect(() => {
    load();
    const interval = setInterval(load, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const closeOnClickAway = () => setOpen(false);
    window.addEventListener("click", closeOnClickAway);
    return () => window.removeEventListener("click", closeOnClickAway);
  }, []);

  const handleItemClick = async (n) => {
    if (n.isRead) return;
    setItems((prev) => prev.map((i) => (i.id === n.id ? { ...i, isRead: true } : i)));
    try {
      await markNotificationRead(n.id);
    } catch {
      // Best-effort — the UI already reflects read, no need to roll back for this.
    }
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      <button
        type="button"
        onClick={() => {
          setOpen((v) => !v);
          if (!loaded) load();
        }}
        title="Notifications"
        className="relative flex h-10 w-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100"
      >
        <Bell size={19} />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 max-h-96 w-80 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            {unreadCount > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-500">
                <CheckCheck size={13} />
                {unreadCount} unread
              </span>
            )}
          </div>

          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-slate-400">
              No notifications yet.
            </p>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(n)}
                    className={`block w-full px-4 py-3 text-left transition hover:bg-slate-50 ${
                      !n.isRead ? "bg-blue-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {!n.isRead && (
                        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-600" />
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900">{n.title}</p>
                        <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.message}</p>
                        <p className="mt-1 text-[11px] text-slate-400">{timeAgo(n.createdAt)}</p>
                      </div>
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
