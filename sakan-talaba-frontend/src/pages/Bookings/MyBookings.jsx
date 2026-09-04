import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
    CalendarDays,
    Clock3,
    CreditCard,
    Eye,
    Home,
    LoaderCircle,
    MapPin,
    RefreshCw,
    Search,
} from "lucide-react";

import { getMyBookings, cancelBooking } from "../../services/bookingService";
import PayNowButton from "../../components/booking/PayNowButton";

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [cancellingId, setCancellingId] = useState(null);

    const [activeFilter, setActiveFilter] = useState("All");
    const [search, setSearch] = useState("");

    // ==========================================================
    // Load Bookings
    // ==========================================================
    const loadBookings = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getMyBookings();

            setBookings(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Get My Bookings Error:", err);

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Failed to load your bookings."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBookings();
    }, []);

    const handleCancel = async (bookingId) => {
        if (!window.confirm("Cancel this booking request?")) return;
        try {
            setCancellingId(bookingId);
            await cancelBooking(bookingId);
            await loadBookings();
        } catch (err) {
            setError(err?.response?.data?.message || err?.response?.data || err?.message || "Failed to cancel booking.");
        } finally {
            setCancellingId(null);
        }
    };

    // A payment just succeeded for one booking — patch it in place instead of
    // reloading the whole list, so the rest of the page doesn't flicker.
    const handleBookingPaid = (bookingId) => {
        setBookings((prev) =>
            prev.map((b) =>
                b.bookingId === bookingId
                    ? { ...b, status: "Confirmed", paymentStatus: "Succeeded" }
                    : b
            )
        );
    };

    // ==========================================================
    // Helpers
    // ==========================================================
    const formatDate = (date) => {
        if (!date) return "-";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "-";
        }

        return parsedDate.toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    const getStatusStyles = (status) => {
        switch (status?.toLowerCase()) {
            case "confirmed":
                return {
                    badge: "bg-green-50 text-green-700 border-green-200",
                    dot: "bg-green-500",
                };

            case "cancelled":
            case "canceled":
                return {
                    badge: "bg-red-50 text-red-700 border-red-200",
                    dot: "bg-red-500",
                };

            case "failed":
                return {
                    badge: "bg-red-50 text-red-700 border-red-200",
                    dot: "bg-red-500",
                };

            case "successed":
            case "succeeded":
                return {
                    badge: "bg-green-50 text-green-700 border-green-200",
                    dot: "bg-green-500",
                };

            default:
                return {
                    badge: "bg-amber-50 text-amber-700 border-amber-200",
                    dot: "bg-amber-500",
                };
        }
    };

    const getPaymentStatus = (paymentStatus) => {
        if (!paymentStatus || paymentStatus === "N/A") {
            return "Pending";
        }

        return paymentStatus;
    };

    const getPaymentStyles = (paymentStatus) => {
        switch (paymentStatus?.toLowerCase()) {
            case "succeeded":
            case "successed":
                return "text-green-700 bg-green-50";

            case "failed":
                return "text-red-700 bg-red-50";

            default:
                return "text-amber-700 bg-amber-50";
        }
    };

    // ==========================================================
    // Filters
    // ==========================================================
    const filteredBookings = useMemo(() => {
        return bookings.filter((booking) => {
            const status = booking.status?.toLowerCase() || "";

            const matchesStatus =
                activeFilter === "All" ||
                status === activeFilter.toLowerCase();

            const searchValue = search.trim().toLowerCase();

            const matchesSearch =
                !searchValue ||
                String(booking.bookingId)
                    .toLowerCase()
                    .includes(searchValue) ||
                booking.roomTypeName
                    ?.toLowerCase()
                    .includes(searchValue) ||
                booking.status
                    ?.toLowerCase()
                    .includes(searchValue);

            return matchesStatus && matchesSearch;
        });
    }, [bookings, activeFilter, search]);

    // ==========================================================
    // Counts
    // ==========================================================
    const bookingCounts = useMemo(() => {
        return {
            all: bookings.length,

            pending: bookings.filter(
                (booking) =>
                    booking.status?.toLowerCase() === "pending"
            ).length,

            confirmed: bookings.filter(
                (booking) =>
                    booking.status?.toLowerCase() === "confirmed"
            ).length,

            cancelled: bookings.filter(
                (booking) =>
                    booking.status?.toLowerCase() === "cancelled" ||
                    booking.status?.toLowerCase() === "canceled"
            ).length,
        };
    }, [bookings]);

    // ==========================================================
    // Loading
    // ==========================================================
    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50">
                <div className="mx-auto max-w-7xl px-6 py-12">

                    <div className="mb-8">
                        <div className="h-4 w-32 animate-pulse rounded bg-slate-200" />
                        <div className="mt-3 h-9 w-64 animate-pulse rounded bg-slate-200" />
                        <div className="mt-3 h-5 w-96 max-w-full animate-pulse rounded bg-slate-200" />
                    </div>

                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="overflow-hidden rounded-2xl border border-slate-200 bg-white"
                            >
                                <div className="h-28 animate-pulse bg-slate-200" />

                                <div className="space-y-4 p-5">
                                    <div className="h-5 w-40 animate-pulse rounded bg-slate-200" />
                                    <div className="h-4 w-full animate-pulse rounded bg-slate-200" />
                                    <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
                                    <div className="h-10 w-full animate-pulse rounded bg-slate-200" />
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>
        );
    }

    // ==========================================================
    // Error
    // ==========================================================
    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-2xl">

                    <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                            <RefreshCw size={24} />
                        </div>

                        <h1 className="mt-5 text-xl font-bold text-slate-900">
                            Could not load bookings
                        </h1>

                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>

                        <button
                            type="button"
                            onClick={loadBookings}
                            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            <RefreshCw size={18} />
                            Try Again
                        </button>

                    </div>

                </div>
            </div>
        );
    }

    // ==========================================================
    // Empty
    // ==========================================================
    if (bookings.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-12">
                <div className="mx-auto max-w-2xl">

                    <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">

                        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                            <CalendarDays size={28} />
                        </div>

                        <h1 className="mt-6 text-2xl font-bold text-slate-900">
                            No bookings yet
                        </h1>

                        <p className="mx-auto mt-2 max-w-md text-slate-500">
                            You haven't made any housing reservations yet.
                            Find a suitable room and start your booking.
                        </p>

                        <Link
                            to="/housing"
                            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Search size={18} />
                            Find Housing
                        </Link>

                    </div>

                </div>
            </div>
        );
    }

    // ==========================================================
    // Main UI
    // ==========================================================
    return (
        <div className="min-h-screen bg-slate-50">

            {/* ====================================================== */}
            {/* Header */}
            {/* ====================================================== */}
            <section className="border-b border-slate-200 bg-white">
                <div className="mx-auto max-w-7xl px-6 py-10">

                    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">

                        <div>
                            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                                Reservations
                            </p>

                            <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                                My Bookings
                            </h1>

                            <p className="mt-2 max-w-xl text-slate-500">
                                Manage your housing reservations and check
                                their current status.
                            </p>
                        </div>

                        <Link
                            to="/housing"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                        >
                            <Search size={18} />
                            Find Housing
                        </Link>

                    </div>

                </div>
            </section>

            {/* ====================================================== */}
            {/* Content */}
            {/* ====================================================== */}
            <main className="mx-auto max-w-7xl px-6 py-8">

                {/* ==================================================== */}
                {/* Stats */}
                {/* ==================================================== */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                    <button
                        type="button"
                        onClick={() => setActiveFilter("All")}
                        className={`rounded-2xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${activeFilter === "All"
                                ? "border-blue-300 ring-2 ring-blue-100"
                                : "border-slate-200"
                            }`}
                    >
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    All Bookings
                                </p>

                                <p className="mt-2 text-3xl font-extrabold text-slate-950">
                                    {bookingCounts.all}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                                <CalendarDays size={21} />
                            </div>

                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("Pending")}
                        className={`rounded-2xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${activeFilter === "Pending"
                                ? "border-amber-300 ring-2 ring-amber-100"
                                : "border-slate-200"
                            }`}
                    >
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Pending
                                </p>

                                <p className="mt-2 text-3xl font-extrabold text-slate-950">
                                    {bookingCounts.pending}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                                <Clock3 size={21} />
                            </div>

                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("Confirmed")}
                        className={`rounded-2xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${activeFilter === "Confirmed"
                                ? "border-green-300 ring-2 ring-green-100"
                                : "border-slate-200"
                            }`}
                    >
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Confirmed
                                </p>

                                <p className="mt-2 text-3xl font-extrabold text-slate-950">
                                    {bookingCounts.confirmed}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                                <Home size={21} />
                            </div>

                        </div>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveFilter("Cancelled")}
                        className={`rounded-2xl border bg-white p-5 text-left transition hover:-translate-y-0.5 hover:shadow-sm ${activeFilter === "Cancelled"
                                ? "border-red-300 ring-2 ring-red-100"
                                : "border-slate-200"
                            }`}
                    >
                        <div className="flex items-center justify-between">

                            <div>
                                <p className="text-sm font-medium text-slate-500">
                                    Cancelled
                                </p>

                                <p className="mt-2 text-3xl font-extrabold text-slate-950">
                                    {bookingCounts.cancelled}
                                </p>
                            </div>

                            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                                <RefreshCw size={21} />
                            </div>

                        </div>
                    </button>

                </div>

                {/* ==================================================== */}
                {/* Search / Filter */}
                {/* ==================================================== */}
                <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:flex-row">

                    <div className="relative flex-1">

                        <Search
                            size={18}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            placeholder="Search by booking, room type or status..."
                            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                        />

                    </div>

                    <div className="flex gap-2 overflow-x-auto">

                        {[
                            "All",
                            "Pending",
                            "Confirmed",
                            "Cancelled",
                        ].map((filter) => (
                            <button
                                key={filter}
                                type="button"
                                onClick={() => setActiveFilter(filter)}
                                className={`whitespace-nowrap rounded-xl px-4 py-3 text-sm font-semibold transition ${activeFilter === filter
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                            >
                                {filter}
                            </button>
                        ))}

                    </div>

                </div>

                {/* ==================================================== */}
                {/* Results */}
                {/* ==================================================== */}
                <div className="mt-6">

                    {filteredBookings.length === 0 ? (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">

                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-slate-500">
                                <Search size={23} />
                            </div>

                            <h2 className="mt-4 text-lg font-bold text-slate-900">
                                No matching bookings
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Try another search term or change the filter.
                            </p>

                        </div>
                    ) : (
                        <div className="grid gap-5 lg:grid-cols-2">

                            {filteredBookings.map((booking) => {
                                const statusStyles =
                                    getStatusStyles(booking.status);

                                const paymentStatus =
                                    getPaymentStatus(
                                        booking.paymentStatus
                                    );

                                const paymentStyles =
                                    getPaymentStyles(paymentStatus);

                                return (
                                    <article
                                        key={booking.bookingId}
                                        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                    >

                                        {/* Card Header */}
                                        <div className="border-b border-slate-100 bg-slate-950 p-5">

                                            <div className="flex items-start justify-between gap-4">

                                                <div className="flex min-w-0 items-center gap-3">

                                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-blue-300">
                                                        <Home size={21} />
                                                    </div>

                                                    <div className="min-w-0">

                                                        <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
                                                            Booking #{booking.bookingId}
                                                        </p>

                                                        <h2 className="mt-1 truncate text-lg font-bold text-white">
                                                            {booking.roomTypeName ||
                                                                "Housing Room"}
                                                        </h2>

                                                    </div>

                                                </div>

                                                <span
                                                    className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${statusStyles.badge}`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${statusStyles.dot}`}
                                                    />

                                                    {booking.status || "Pending"}
                                                </span>

                                            </div>

                                        </div>

                                        {/* Card Body */}
                                        <div className="p-5">

                                            {/* Dates */}
                                            <div className="grid gap-4 sm:grid-cols-2">

                                                <div className="rounded-xl bg-slate-50 p-4">

                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <CalendarDays size={16} />
                                                        <span className="text-xs font-semibold uppercase tracking-wide">
                                                            Check-in
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 font-bold text-slate-900">
                                                        {formatDate(
                                                            booking.checkInDate
                                                        )}
                                                    </p>

                                                </div>

                                                <div className="rounded-xl bg-slate-50 p-4">

                                                    <div className="flex items-center gap-2 text-slate-500">
                                                        <CalendarDays size={16} />
                                                        <span className="text-xs font-semibold uppercase tracking-wide">
                                                            Check-out
                                                        </span>
                                                    </div>

                                                    <p className="mt-2 font-bold text-slate-900">
                                                        {formatDate(
                                                            booking.checkOutDate
                                                        )}
                                                    </p>

                                                </div>

                                            </div>

                                            {/* Payment */}
                                            <div className="mt-4 flex flex-col gap-4 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">

                                                <div className="flex items-center gap-3">

                                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-slate-600">
                                                        <CreditCard size={18} />
                                                    </div>

                                                    <div>
                                                        <p className="text-xs text-slate-500">
                                                            Payment
                                                        </p>

                                                        <p className="font-semibold text-slate-900">
                                                            {booking.paymentMethod &&
                                                                booking.paymentMethod !==
                                                                "N/A"
                                                                ? booking.paymentMethod
                                                                : "Not paid yet"}
                                                        </p>
                                                    </div>

                                                </div>

                                                <span
                                                    className={`rounded-lg px-3 py-1.5 text-xs font-bold ${paymentStyles}`}
                                                >
                                                    {paymentStatus}
                                                </span>

                                            </div>

                                            {/* Footer */}
                                            <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

                                                <div>
                                                    <p className="text-xs text-slate-500">
                                                        Total Cost
                                                    </p>

                                                    <p className="mt-1 text-xl font-extrabold text-slate-950">
                                                        {Number(
                                                            booking.totalCost || 0
                                                        ).toLocaleString()}{" "}
                                                        <span className="text-sm font-semibold text-slate-500">
                                                            EGP
                                                        </span>
                                                    </p>
                                                </div>

                                                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                                                    {booking.status?.toLowerCase() === "ownerapproved" && (
                                                        <PayNowButton
                                                            bookingId={booking.bookingId}
                                                            onPaid={() => handleBookingPaid(booking.bookingId)}
                                                        />
                                                    )}
                                                    {["pending", "ownerapproved"].includes(booking.status?.toLowerCase()) && (
                                                        <button
                                                            type="button"
                                                            disabled={cancellingId === booking.bookingId}
                                                            onClick={() => handleCancel(booking.bookingId)}
                                                            className="rounded-xl border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                        >
                                                            {cancellingId === booking.bookingId ? "Cancelling..." : "Cancel"}
                                                        </button>
                                                    )}

                                                    <Link
                                                        to={`/bookings/${booking.bookingId}`}
                                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                                    >
                                                        <Eye size={17} />
                                                        View Details
                                                    </Link>
                                                </div>

                                            </div>

                                        </div>
                                    </article>
                                );
                            })}

                        </div>
                    )}

                </div>

            </main>
        </div>
    );
}

export default MyBookings;