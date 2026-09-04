import { useState } from "react";
import {
    CalendarDays,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import { createHousingBooking } from "../../services/bookingService";

const BookingForm = ({ room }) => {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [nationalId, setNationalId] = useState("");
    const [universityId, setUniversityId] = useState("");
    const [fullName, setFullName] = useState("");
    const [mobile, setMobile] = useState("");
    const [email, setEmail] = useState("");
    const [durationMonths, setDurationMonths] = useState(1);
    const [notes, setNotes] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CashOnArrival");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess(false);

        if (!checkIn || !checkOut) {
            setError("من فضلك اختر تاريخ الدخول والخروج.");
            return;
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            setError("تاريخ الخروج يجب أن يكون بعد تاريخ الدخول.");
            return;
        }

        try {
            setLoading(true);

            await createHousingBooking({
                housingRoomId: room.housingRoomId ?? room.roomId ?? room.id,
                checkIn,
                checkOut,
                nationalId,
                universityId,
                studentName: fullName,
                mobile,
                email,
                durationMonths: Number(durationMonths),
                notes,
                paymentMethod,
            });

            setSuccess(true);

            setCheckIn("");
            setCheckOut("");
            setNationalId("");
            setUniversityId("");
            setFullName("");
            setMobile("");
            setEmail("");
            setDurationMonths(1);
            setNotes("");
        } catch (err) {
            console.error("Booking error:", err);

            const message =
                err?.response?.data?.message ||
                err?.response?.data ||
                "حدث خطأ أثناء إنشاء الحجز.";

            setError(
                typeof message === "string"
                    ? message
                    : "حدث خطأ أثناء إنشاء الحجز."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl border bg-white p-6 shadow-sm">
            <h3 className="mb-5 text-xl font-bold text-gray-800">
                احجز الغرفة
            </h3>

            {success && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
                    <CheckCircle size={20} />
                    <span>تم إنشاء الحجز بنجاح.</span>
                </div>
            )}

            {error && (
                <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-50 p-3 text-red-700">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Check In */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        تاريخ الدخول
                    </label>

                    <div className="relative">
                        <CalendarDays
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="date"
                            value={checkIn}
                            onChange={(e) => setCheckIn(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-lg border px-10 py-3 outline-none focus:border-blue-500"
                            required
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <input required placeholder="الرقم القومي" value={nationalId} onChange={(e) => setNationalId(e.target.value)} className="rounded-lg border px-3 py-3" />
                        <input required placeholder="الرقم الجامعي" value={universityId} onChange={(e) => setUniversityId(e.target.value)} className="rounded-lg border px-3 py-3" />
                        <input required placeholder="الاسم بالكامل" value={fullName} onChange={(e) => setFullName(e.target.value)} className="rounded-lg border px-3 py-3" />
                        <input required type="tel" placeholder="رقم الموبايل" value={mobile} onChange={(e) => setMobile(e.target.value)} className="rounded-lg border px-3 py-3" />
                        <input required type="email" placeholder="البريد الإلكتروني" value={email} onChange={(e) => setEmail(e.target.value)} className="rounded-lg border px-3 py-3" />
                        <input required type="number" min="1" max="24" placeholder="المدة بالشهور" value={durationMonths} onChange={(e) => setDurationMonths(e.target.value)} className="rounded-lg border px-3 py-3" />
                    </div>

                    <textarea placeholder="ملاحظات (اختياري)" value={notes} onChange={(e) => setNotes(e.target.value)} className="w-full rounded-lg border px-3 py-3" rows={3} />
                    <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} className="w-full rounded-lg border px-3 py-3">
                        <option value="CashOnArrival">الدفع عند الوصول</option>
                        <option value="Stripe">الدفع الإلكتروني</option>
                    </select>
                </div>

                {/* Check Out */}
                <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                        تاريخ الخروج
                    </label>

                    <div className="relative">
                        <CalendarDays
                            size={18}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="date"
                            value={checkOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                            min={
                                checkIn ||
                                new Date().toISOString().split("T")[0]
                            }
                            className="w-full rounded-lg border px-10 py-3 outline-none focus:border-blue-500"
                            required
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? (
                        <>
                            <Loader2 size={20} className="animate-spin" />
                            جاري إنشاء الحجز...
                        </>
                    ) : (
                        "احجز الآن"
                    )}
                </button>
            </form>
        </div>
    );
};

export default BookingForm;