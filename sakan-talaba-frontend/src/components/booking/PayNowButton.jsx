import { useState } from "react";
import { CreditCard, Loader2, Smartphone, ChevronDown } from "lucide-react";
import { confirmPayment, initiatePaymobPayment } from "../../services/bookingService";
import { getApiError } from "../../services/api";

/**
 * Pay-now button with two flows:
 * - Paymob (real online payment): the student picks "card" or "mobile wallet",
 *   the backend returns the Paymob payment URL and the browser is redirected
 *   there. Paymob calls back to the backend, which verifies the payment and
 *   sends the student to /payment/result.
 * - CashOnArrival (legacy): the backend `confirm-payment` endpoint simply
 *   records the given transaction id and marks the booking Confirmed.
 */
const makeMockTransactionId = () =>
  `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

const isValidEgyptianMobile = (n) => /^01[0-9]{9}$/.test((n || "").trim());

export default function PayNowButton({ bookingId, paymentMethod, onPaid, className = "" }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [payType, setPayType] = useState("card"); // "card" | "wallet"
  const [walletNumber, setWalletNumber] = useState("");

  const isPaymob = String(paymentMethod || "").toLowerCase() === "paymob";

  const handleLegacyPay = async () => {
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

  const handlePaymobPay = async () => {
    if (payType === "wallet" && !isValidEgyptianMobile(walletNumber)) {
      setError("Enter a valid wallet mobile number (01xxxxxxxxx).");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const { paymentUrl } = await initiatePaymobPayment(
        bookingId,
        payType,
        payType === "wallet" ? walletNumber.trim() : null
      );
      if (!paymentUrl) throw new Error("Payment page URL was not returned.");
      window.location.href = paymentUrl;
    } catch (err) {
      setError(getApiError(err, "Payment could not be started."));
      setLoading(false);
    }
  };

  if (!isPaymob) {
    return (
      <div className={`flex flex-col items-start gap-1.5 ${className}`}>
        <button
          type="button"
          onClick={handleLegacyPay}
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

  return (
    <div className={`flex flex-col items-stretch gap-2 ${className}`}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
      >
        <CreditCard size={17} />
        Pay Securely Online
        <ChevronDown size={16} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
      </button>

      {expanded && (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPayType("card")}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                payType === "card"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <CreditCard size={16} />
              Card
            </button>
            <button
              type="button"
              onClick={() => setPayType("wallet")}
              className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-semibold transition ${
                payType === "wallet"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <Smartphone size={16} />
              Mobile Wallet
            </button>
          </div>

          {payType === "wallet" && (
            <div className="mt-3">
              <label className="mb-1 block text-xs font-medium text-slate-600">
                Wallet mobile number (Vodafone Cash, Orange Money, ...)
              </label>
              <input
                type="tel"
                dir="ltr"
                placeholder="01xxxxxxxxx"
                value={walletNumber}
                onChange={(e) => setWalletNumber(e.target.value.replace(/[^\d]/g, "").slice(0, 11))}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-left focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handlePaymobPay}
            disabled={loading}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <Loader2 size={17} className="animate-spin" /> : <CreditCard size={17} />}
            {loading
              ? "Redirecting to secure payment..."
              : payType === "wallet"
                ? "Pay with Mobile Wallet"
                : "Pay with Card"}
          </button>

          {error && <p className="mt-2 text-xs font-medium text-red-600">{error}</p>}

          <p className="mt-2 text-[11px] leading-relaxed text-slate-400">
            You will be redirected to Paymob's secure page to complete the payment.
          </p>
        </div>
      )}

      {error && !expanded && <p className="text-xs font-medium text-red-600">{error}</p>}
    </div>
  );
}
