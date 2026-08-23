import { useEffect, useState } from "react";
import {
    CalendarDays,
    ChevronRight,
    Clock3,
    CreditCard,
    Home,
    MapPin,
    RefreshCcw,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    getMyBookings,
} from "../../services/bookingService";

function MyBookings() {
    const [bookings, setBookings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getMyBookings();

            console.log(
                "My Bookings:",
                data
            );

            setBookings(
                Array.isArray(data)
                    ? data
                    : []
            );
        } catch (err) {
            console.error(
                "My Bookings Error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.message ||
                "Failed to load bookings."
            );

            setBookings([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const getStatusClass = (
        status
    ) => {
        switch (
        String(status || "").toLowerCase()
        ) {
            case "confirmed":
            case "successed":
            case "succeeded":
                return "bg-green-100 text-green-700";

            case "pending":
                return "bg-yellow-100 text-yellow-700";

            case "failed":
                return "bg-red-100 text-red-700";

            default:
                return "bg-slate-100 text-slate-600";
        }
    };

    const getPaymentStatusClass = (
        status
    ) => {
        switch (
        String(status || "").toLowerCase()
        ) {
            case "succeeded":
            case "successed":
                return "text-green-600";

            case "failed":
                return "text-red-600";

            default:
                return "text-yellow-600";
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <section className="bg-slate-950">
                <div className="mx-auto max-w-7xl px-6 py-14">

                    <p className="font-semibold text-blue-400">
                        BOOKINGS
                    </p>

                    <h1 className="mt-2 text-4xl font-extrabold text-white">
                        My Bookings
                    </h1>

                    <p className="mt-3 max-w-2xl text-slate-300">
                        Track your housing reservations,
                        dates, payment status and booking
                        status.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Loading */}
                {loading && (
                    <div className="space-y-5">
                        {[1, 2, 3].map(
                            (item) => (
                                <div
                                    key={item}
                                    className="h-48 animate-pulse rounded-2xl bg-white shadow-sm"
                                />
                            )
                        )}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">

                        <p className="text-red-600">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadBookings}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 font-semibold text-white"
                        >
                            <RefreshCcw size={17} />
                            Try Again
                        </button>

                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    bookings.length === 0 && (
                        <div className="rounded-2xl bg-white p-14 text-center shadow-sm">

                            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                                <CalendarDays size={36} />
                            </div>

                            <h2 className="mt-5 text-2xl font-bold text-slate-900">
                                No Bookings Yet
                            </h2>

                            <p className="mx-auto mt-2 max-w-md text-slate-500">
                                You don't have any housing
                                bookings yet.
                            </p>

                            <Link
                                to="/housing"
                                className="mt-6 inline-flex rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                            >
                                Browse Housing
                            </Link>

                        </div>
                    )}

                {/* Bookings */}
                {!loading &&
                    !error &&
                    bookings.length > 0 && (
                        <div className="space-y-5">

                            {bookings.map(
                                (booking) => (
                                    <div
                                        key={
                                            booking.bookingId
                                        }
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
                                    >

                                        {/* Top */}
                                        <div className="flex flex-col gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                                            <div className="flex items-center gap-4">

                                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                                    <Home size={22} />
                                                </div>

                                                <div>

                                                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                                        Booking
                                                    </p>

                                                    <h2 className="font-bold text-slate-900">
                                                        #{booking.bookingId}
                                                    </h2>

                                                </div>
                                            </div>

                                            <span
                                                className={`w-fit rounded-full px-3 py-1.5 text-sm font-semibold ${getStatusClass(
                                                    booking.status
                                                )}`}
                                            >
                                                {booking.status ||
                                                    "Unknown"}
                                            </span>

                                        </div>

                                        {/* Body */}
                                        <div className="grid gap-6 p-5 md:grid-cols-2 lg:grid-cols-4">

                                            {/* Dates */}
                                            <div className="flex gap-3">
                                                <CalendarDays
                                                    size={20}
                                                    className="mt-1 text-blue-600"
                                                />

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Stay
                                                    </p>

                                                    <p className="mt-1 text-sm font-semibold text-slate-900">
                                                        {formatDate(
                                                            booking.checkInDate
                                                        )}
                                                    </p>

                                                    <p className="text-sm text-slate-500">
                                                        to{" "}
                                                        {formatDate(
                                                            booking.checkOutDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Room */}
                                            <div className="flex gap-3">
                                                <Home
                                                    size={20}
                                                    className="mt-1 text-blue-600"
                                                />

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Room
                                                    </p>

                                                    <p className="mt-1 font-semibold text-slate-900">
                                                        {booking.roomNumber ||
                                                            "N/A"}
                                                    </p>

                                                    <p className="text-sm text-slate-500">
                                                        {booking.roomTypeName ||
                                                            "Room type not specified"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Cost */}
                                            <div className="flex gap-3">
                                                <CreditCard
                                                    size={20}
                                                    className="mt-1 text-blue-600"
                                                />

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Total Cost
                                                    </p>

                                                    <p className="mt-1 font-bold text-blue-600">
                                                        {Number(
                                                            booking.totalCost ||
                                                            0
                                                        ).toLocaleString()}{" "}
                                                        EGP
                                                    </p>

                                                    <p className="text-sm text-slate-500">
                                                        {booking.paymentMethod ||
                                                            "Payment not specified"}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Payment */}
                                            <div className="flex gap-3">
                                                <Clock3
                                                    size={20}
                                                    className="mt-1 text-blue-600"
                                                />

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Payment
                                                    </p>

                                                    <p
                                                        className={`mt-1 font-semibold ${getPaymentStatusClass(
                                                            booking.paymentStatus
                                                        )}`}
                                                    >
                                                        {booking.paymentStatus ||
                                                            "Pending"}
                                                    </p>

                                                    <p className="text-sm text-slate-500">
                                                        Booked{" "}
                                                        {formatDate(
                                                            booking.bookingDate
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                        </div>

                                        {/* Footer */}
                                        <div className="flex justify-end border-t border-slate-100 px-5 py-4">

                                            <Link
                                                to={`/bookings/${booking.bookingId}`}
                                                className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                                            >
                                                View Details

                                                <ChevronRight
                                                    size={17}
                                                />
                                            </Link>

                                        </div>
                                    </div>
                                )
                            )}

                        </div>
                    )}

            </main>
        </div>
    );
}

function formatDate(value) {
    if (!value) {
        return "N/A";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "N/A";
    }

    return date.toLocaleDateString(
        "en-GB"
    );
}

export default MyBookings;