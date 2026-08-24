import { useEffect, useState } from "react";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Home,
    LoaderCircle,
    Receipt,
    CreditCard,
    AlertCircle,
} from "lucide-react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getBookingById,
} from "../../services/bookingService";

function BookingConfirmation() {
    const navigate = useNavigate();

    const { id } = useParams();

    const [booking, setBooking] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    // ==========================================================
    // Load Booking
    // ==========================================================
    useEffect(() => {
        const loadBooking = async () => {
            if (!id) {
                setError(
                    "Booking ID was not provided."
                );

                setLoading(false);

                return;
            }

            try {
                setLoading(true);
                setError("");

                const result =
                    await getBookingById(id);

                setBooking(result);
            } catch (err) {
                console.error(
                    "Get Booking Error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.response?.data ||
                    err?.message ||
                    "Failed to load booking."
                );
            } finally {
                setLoading(false);
            }
        };

        loadBooking();
    }, [id]);

    // ==========================================================
    // Loading
    // ==========================================================
    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <LoaderCircle
                        size={42}
                        className="animate-spin text-blue-600"
                    />

                    <p className="text-sm text-slate-500">
                        Loading booking...
                    </p>
                </div>
            </div>
        );
    }

    // ==========================================================
    // Error
    // ==========================================================
    if (error || !booking) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-2xl">

                    <button
                        type="button"
                        onClick={() =>
                            navigate("/my-bookings")
                        }
                        className="mb-6 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                        <ArrowLeft size={18} />

                        My Bookings
                    </button>

                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                        <AlertCircle
                            size={48}
                            className="mx-auto mb-4 text-red-500"
                        />

                        <h1 className="text-xl font-bold text-red-700">
                            Unable to load booking
                        </h1>

                        <p className="mt-2 text-sm text-red-600">
                            {error ||
                                "Booking was not found."}
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">

            <div className="mx-auto max-w-3xl">

                {/* Back */}
                <button
                    type="button"
                    onClick={() =>
                        navigate("/my-bookings")
                    }
                    className="mb-6 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={18} />

                    My Bookings
                </button>

                {/* Success Header */}
                <div className="mb-6 overflow-hidden rounded-2xl bg-white shadow-sm">

                    <div className="flex flex-col items-center justify-center bg-green-50 px-6 py-10 text-center">

                        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">

                            <CheckCircle2
                                size={38}
                                className="text-green-600"
                            />

                        </div>

                        <h1 className="text-3xl font-extrabold text-slate-900">
                            Booking Request Created
                        </h1>

                        <p className="mt-2 max-w-xl text-slate-600">
                            Your booking request has been created successfully.
                        </p>

                    </div>

                    {/* Booking ID */}
                    <div className="border-t border-slate-100 px-6 py-5">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                    Booking ID
                                </p>

                                <p className="mt-1 text-xl font-bold text-slate-900">
                                    #{booking.bookingId}
                                </p>
                            </div>

                            <BookingStatus
                                status={booking.status}
                            />

                        </div>

                    </div>
                </div>

                {/* Booking Details */}
                <div className="rounded-2xl bg-white p-6 shadow-sm">

                    <h2 className="mb-6 text-xl font-bold text-slate-900">
                        Booking Details
                    </h2>

                    <div className="grid gap-4 md:grid-cols-2">

                        {/* Room */}
                        <DetailCard
                            icon={
                                <Home size={21} />
                            }
                            label="Room"
                            value={
                                booking.roomNumber ||
                                "N/A"
                            }
                        />

                        {/* Room Type */}
                        <DetailCard
                            icon={
                                <Receipt size={21} />
                            }
                            label="Room Type"
                            value={
                                booking.roomTypeName ||
                                "N/A"
                            }
                        />

                        {/* Check In */}
                        <DetailCard
                            icon={
                                <CalendarDays
                                    size={21}
                                />
                            }
                            label="Check-in"
                            value={formatDate(
                                booking.checkInDate
                            )}
                        />

                        {/* Check Out */}
                        <DetailCard
                            icon={
                                <CalendarDays
                                    size={21}
                                />
                            }
                            label="Check-out"
                            value={formatDate(
                                booking.checkOutDate
                            )}
                        />

                        {/* Booking Date */}
                        <DetailCard
                            icon={
                                <Clock3 size={21} />
                            }
                            label="Booking Date"
                            value={formatDate(
                                booking.bookingDate
                            )}
                        />

                        {/* Payment */}
                        <DetailCard
                            icon={
                                <CreditCard
                                    size={21}
                                />
                            }
                            label="Payment"
                            value={
                                booking.paymentStatus ||
                                "Pending"
                            }
                        />

                    </div>

                    {/* Total */}
                    <div className="mt-6 rounded-xl bg-slate-950 p-5 text-white">

                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm text-slate-400">
                                    Total Cost
                                </p>

                                <p className="mt-1 text-2xl font-extrabold">
                                    {formatCurrency(
                                        booking.totalCost
                                    )}
                                </p>
                            </div>

                            <Receipt
                                size={32}
                                className="text-slate-400"
                            />

                        </div>

                    </div>

                    {/* Payment Notice */}
                    {booking.paymentStatus ===
                        "N/A" && (
                            <div className="mt-5 rounded-xl border border-yellow-200 bg-yellow-50 p-4">

                                <div className="flex gap-3">

                                    <Clock3
                                        size={20}
                                        className="mt-0.5 shrink-0 text-yellow-600"
                                    />

                                    <div>

                                        <p className="font-semibold text-yellow-800">
                                            Payment is pending
                                        </p>

                                        <p className="mt-1 text-sm text-yellow-700">
                                            Your booking has been created and is waiting for payment.
                                        </p>

                                    </div>

                                </div>
                            </div>
                        )}

                    {/* Actions */}
                    <div className="mt-6 grid gap-3 md:grid-cols-2">

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/my-bookings"
                                )
                            }
                            className="rounded-xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                            View My Bookings
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/")
                            }
                            className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            Back to Home
                        </button>

                    </div>

                </div>
            </div>
        </div>
    );
}

// ==========================================================
// Components
// ==========================================================

function DetailCard({
    icon,
    label,
    value,
}) {
    return (
        <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">

            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                {icon}
            </div>

            <div className="min-w-0">

                <p className="text-xs font-medium text-slate-400">
                    {label}
                </p>

                <p className="mt-1 truncate font-bold text-slate-800">
                    {value}
                </p>

            </div>
        </div>
    );
}

function BookingStatus({
    status,
}) {
    const normalized =
        status?.toLowerCase();

    let className =
        "bg-slate-100 text-slate-700";

    if (
        normalized === "confirmed" ||
        normalized === "successed" ||
        normalized === "succeeded"
    ) {
        className =
            "bg-green-100 text-green-700";
    } else if (
        normalized === "pending"
    ) {
        className =
            "bg-yellow-100 text-yellow-700";
    } else if (
        normalized === "cancelled" ||
        normalized === "failed"
    ) {
        className =
            "bg-red-100 text-red-700";
    }

    return (
        <span
            className={`rounded-full px-4 py-2 text-sm font-bold ${className}`}
        >
            {status || "Unknown"}
        </span>
    );
}

// ==========================================================
// Helpers
// ==========================================================

function formatDate(date) {
    if (!date) {
        return "N/A";
    }

    return new Date(date).toLocaleDateString(
        "en-GB",
        {
            year: "numeric",
            month: "short",
            day: "numeric",
        }
    );
}

function formatCurrency(amount) {
    const value =
        Number(amount) || 0;

    return `${value.toLocaleString("en-EG")} EGP`;
}

export default BookingConfirmation;