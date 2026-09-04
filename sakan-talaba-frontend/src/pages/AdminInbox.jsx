import { useEffect, useState } from "react";
import { getContactMessages, markContactMessageRead } from "../services/adminService";
import { getApiError } from "../services/api";

export default function AdminInbox() {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState("");

  const load = async () => {
    try {
      setMessages(await getContactMessages());
    } catch (e) {
      setError(getApiError(e, "Could not load inbox."));
    }
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await markContactMessageRead(id);
    setMessages((items) => items.map((item) => item.id === id ? { ...item, isRead: true } : item));
  };

  return (
    <div className="rounded-2xl border bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">Inbox</h1>
      {error && <p className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}
      <div className="mt-5 space-y-3">
        {messages.length === 0 && <p className="text-slate-500">No messages.</p>}
        {messages.map((message) => (
          <article key={message.id} className={`rounded-xl border p-4 ${message.isRead ? "bg-white" : "bg-blue-50"}`}>
            <div className="flex flex-wrap justify-between gap-2">
              <div><h2 className="font-semibold text-slate-900">{message.subject || "No subject"}</h2><p className="text-sm text-slate-500">{message.name} · {message.email}</p></div>
              {!message.isRead && <button onClick={() => markRead(message.id)} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white">Mark read</button>}
            </div>
            <p className="mt-3 text-sm text-slate-700">{message.message}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
