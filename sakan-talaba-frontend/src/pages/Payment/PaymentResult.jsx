import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, AlertTriangle, ArrowRight } from "lucide-react";

/**
 * Landing page after a Paymob payment attempt. The backend verifies the
 * Paymob callback (HMAC) and redirects here with:
 *   ?status=success&bookingId=123   → payment confirmed
 *   ?status=failed&bookingId=123    → payment failed / cancelled
 *   ?status=failed&reason=...       → callback rejected
 */
export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status");
  const bookingId = searchParams.get("bookingId");
  const reason = searchParams.get("reason");

  const success = status === "success";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-10" dir="rtl">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-lg">
        {success ? (
          <CheckCircle2 size={64} className="mx-auto text-emerald-500" />
        ) : (
          <XCircle size={64} className="mx-auto text-red-500" />
        )}

        <h1 className="mt-4 text-2xl font-bold text-slate-900">
          {success ? "تم الدفع بنجاح" : "فشلت عملية الدفع"}
        </h1>

        <p className="mt-2 text-sm text-slate-600">
          {success
            ? "تم تأكيد الدفع وحجزك أصبح مؤكدًا. بالتوفيق في سكنك الجديد!"
            : reason === "invalid_signature"
              ? "تعذر التحقق من عملية الدفع. تواصل مع الدعم لو تم خصم المبلغ."
              : "لم يتم إتمام الدفع. يمكنك المحاولة مرة أخرى من صفحة الحجز."}
        </p>

        {bookingId && (
          <p className="mt-3 text-xs text-slate-400">رقم الحجز: {bookingId}</p>
        )}

        <div className="mt-6 flex flex-col gap-2">
          {bookingId ? (
            <Link
              to={`/bookings/${bookingId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              عرض تفاصيل الحجز
              <ArrowRight size={16} />
            </Link>
          ) : (
            <Link
              to="/bookings"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              حجوزاتي
              <ArrowRight size={16} />
            </Link>
          )}

          {!success && bookingId && (
            <Link
              to={`/bookings/${bookingId}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <AlertTriangle size={16} />
              المحاولة مرة أخرى
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
