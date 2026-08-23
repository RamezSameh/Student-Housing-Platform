import { useState } from "react";
import {
    CalendarDays,
    Loader2,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

import { createBooking } from "../../services/bookingService";

const BookingForm = ({ room }) => {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");

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

            await createBooking({
                roomId: room.housingRoomId ?? room.roomId ?? room.id,
                checkIn,
                checkOut,
            });

            setSuccess(true);

            setCheckIn("");
            setCheckOut("");
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