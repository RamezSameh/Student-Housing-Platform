import { useState } from "react";
import { CreditCard, Loader2 } from "lucide-react";
import { confirmPayment, initiatePaymobPayment } from "../../services/bookingService";
import { getApiError } from "../../services/api";

/**
 * Pay-now button with two flows:
 * - Paymob (real card payment): asks the backend for a Paymob payment page
 *   and redirects the browser there. Paymob calls back to the backend, which
 *   verifies the payment and sends the student to /payment/result.
 * - CashOnArrival (legacy): the backend `confirm-payment` endpoint simply
 *   records the given transaction id and marks the booking Confirmed.
 */
const makeMockTransactionId = () =>
  `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

export default function PayNowButton({ bookingId, paymentMethod, onPaid, className = "" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isPaymob = String(paymentMethod || "").toLowerCase() === "paymob";

  const handlePay = async () => {
    setLoading(true);
    setError("");
    try {
      if (isPaymob) {
        const { paymentUrl } = await initiatePaymobPayment(bookingId);
        if (!paymentUrl) throw new Error("Payment page URL was not returned.");
        window.location.href = paymentUrl;
        return;
      }
      await confirmPayment(bookingId, makeMockTransactionId());
      onPaid?.();
    } catch (err) {
      setError(getApiError(err, "Payment could not be started."));
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
        {loading
          ? isPaymob
            ? "Redirecting to secure payment..."
            : "Confirming payment..."
          : isPaymob
            ? "Pay Securely with Card"
            : "Pay Now"}
      </button>
      {error && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
