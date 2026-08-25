import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { confirmPayment } from "../../services/bookingService";
import { getApiError } from "../../services/api";

/**
 * The backend doesn't integrate a real payment gateway yet — `confirm-payment`
 * simply records whatever transaction id it's given and marks the booking as
 * Confirmed / Succeeded. We generate a mock transaction id client-side so the
 * booking lifecycle (Pending -> Confirmed) can actually be completed end to end.
 */
const makeMockTransactionId = () =>
  `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function PayNowButton({ bookingId, onPaid, className = "" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      await confirmPayment(bookingId, makeMockTransactionId());
      onPaid?.();
    } catch (err) {
      setError(getApiError(err, "Payment could not be confirmed."));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex flex-col items-start gap-1.5 ${className}`}>
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? <Loader2 size={17} className="animate-spin" /> : <CreditCard size={17} />}
        {loading ? "Confirming payment..." : "Pay Now"}
      </button>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
