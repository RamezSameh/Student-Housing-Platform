import { useState } from "react";
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle2 } from "lucide-react";
import { sendContactMessage } from "../services/contactService";
import { getApiError } from "../services/api";
import { useAuth } from "../context/AuthContext";

const emptyForm = { name: "", email: "", phone: "", subject: "", message: "" };

export default function ContactUs() {
  const { user } = useAuth();
  const [form, setForm] = useState({ ...emptyForm, name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(), email: user?.email || "", phone: user?.mobile || "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      await sendContactMessage(form);
      setSent(true);
      setForm(emptyForm);
    } catch (err) {
      setError(getApiError(err, "Could not send your message. Please try again."));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="bg-slate-50">
      <section className="bg-slate-950 py-14 text-center">
        <p className="font-semibold text-blue-400">GET IN TOUCH</p>
        <h1 className="mt-2 text-4xl font-extrabold text-white">Contact Us</h1>
        <p className="mx-auto mt-3 max-w-xl px-4 text-slate-300">
          Questions about a listing, a booking, or partnering with us as an owner?
          We're happy to help.
        </p>
      </section>

      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-5">
        {/* Contact info */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-start gap-3 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Mail size={19} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Email</p>
              <p className="font-semibold text-slate-900">support@sakantalaba.com</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Phone size={19} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Phone</p>
              <p className="font-semibold text-slate-900">+20 100 000 0000</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-2xl border bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MapPin size={19} />
            </div>
            <div>
              <p className="text-sm text-slate-500">Office</p>
              <p className="font-semibold text-slate-900">New Cairo, Cairo, Egypt</p>
            </div>
          </div>

          <div className="overflow-hidden rounded-2xl border shadow-sm">
            <iframe
              title="Our location"
              width="100%"
              height="220"
              loading="lazy"
              style={{ border: 0 }}
              src="https://www.google.com/maps?q=New+Cairo,Cairo,Egypt&output=embed"
            />
          </div>
        </div>

        {/* Inquiry form */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">
            {sent ? (
              <div className="flex flex-col items-center py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-50 text-green-600">
                  <CheckCircle2 size={28} />
                </div>
                <h2 className="mt-4 text-xl font-bold text-slate-900">Message sent</h2>
                <p className="mt-1 text-slate-500">We'll get back to you as soon as we can.</p>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-5 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h2 className="text-lg font-bold text-slate-900">Send us your inquiry</h2>

                {error && (
                  <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-700">
                    {error}
                  </div>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Name</label>
                    <input
                      required
                      value={form.name}
                      onChange={handleChange("name")}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
                    <input
                      required
                      type="email"
                      value={form.email}
                      onChange={handleChange("email")}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Phone (optional)
                    </label>
                    <input
                      value={form.phone}
                      onChange={handleChange("phone")}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium text-slate-700">
                      Subject (optional)
                    </label>
                    <input
                      value={form.subject}
                      onChange={handleChange("subject")}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">Message</label>
                  <textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange("message")}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={sending}
                  className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
