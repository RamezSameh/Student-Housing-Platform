import { useEffect, useState } from "react";

import {
    ArrowLeft,
    CalendarDays,
    CreditCard,
    Home,
    Receipt,
} from "lucide-react";

import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import {
    getBookingById,
} from "../../services/bookingService";
import PayNowButton from "../../components/booking/PayNowButton";

function BookingDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [booking, setBooking] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const loadBooking = async () => {
        try {
            setLoading(true);
            setError("");

            const data =
                await getBookingById(id);

            console.log(
                "Booking Details:",
                data
            );

            setBooking(
                data?.data ??
                data
            );
        } catch (err) {
            console.error(
                "Booking Details Error:",
                err
            );

            setError(
                err?.response?.data
                    ?.message ||
                err?.message ||
                "Failed to load booking."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadBooking();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-6 py-10">
                <div className="mx-auto max-w-4xl">

                    <div className="h-8 w-32 animate-pulse rounded bg-slate-200" />

                    <div className="mt-6 h-80 animate-pulse rounded-2xl bg-white" />

                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[500px] items-center justify-center px-6">

                <div className="text-center">

                    <p className="text-red-600">
                        {error}
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            navigate(-1)
                        }
                        className="mt-5 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white"
                    >
                        Go Back
                    </button>

                </div>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                Booking not found.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">

            <div className="mx-auto max-w-4xl">

                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="mb-6 flex items-center gap-2 font-semibold text-blue-600"
                >
                    <ArrowLeft size={18} />

                    Back
                </button>

                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                    {/* Header */}

                    <div className="border-b border-slate-100 p-6">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>
                                <p className="text-sm text-slate-500">
                                    Booking
                                </p>

                                <h1 className="mt-1 text-3xl font-bold text-slate-900">
                                    #{booking.bookingId}
                                </h1>
                            </div>

                            <span className="rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
                                {booking.status ||
                                    "Pending"}
                            </span>

                        </div>
                    </div>

                    {/* Details */}

                    <div className="grid gap-5 p-6 md:grid-cols-2">

                        <BookingInfo
                            icon={
                                <CalendarDays />
                            }
                            label="Check In"
                            value={formatDate(
                                booking.checkInDate
                            )}
                        />

                        <BookingInfo
                            icon={
                                <CalendarDays />
                            }
                            label="Check Out"
                            value={formatDate(
                                booking.checkOutDate
                            )}
                        />

                        <BookingInfo
                            icon={<Home />}
                            label="Room"
                            value={
                                booking.roomNumber ||
                                "N/A"
                            }
                        />

                        <BookingInfo
                            icon={<Home />}
                            label="Room Type"
                            value={
                                booking.roomTypeName ||
                                "N/A"
                            }
                        />

                        <BookingInfo
                            icon={<Receipt />}
                            label="Total Cost"
                            value={`${Number(
                                booking.totalCost ||
                                0
                            ).toLocaleString()} EGP`}
                        />

                        <BookingInfo
                            icon={
                                <CreditCard />
                            }
                            label="Payment Method"
                            value={
                                booking.paymentMethod ||
                                "N/A"
                            }
                        />

                        <BookingInfo
                            icon={
                                <CreditCard />
                            }
                            label="Payment Status"
                            value={
                                booking.paymentStatus ||
                                "Pending"
                            }
                        />

                        <BookingInfo
                            icon={
                                <CalendarDays />
                            }
                            label="Booking Date"
                            value={formatDate(
                                booking.bookingDate
                            )}
                        />

                    </div>

                    {/* Actions */}

                    <div className="flex flex-col gap-3 border-t border-slate-100 p-6 sm:flex-row">

                        {booking.status?.toLowerCase() === "ownerapproved" && (
                            <PayNowButton
                                bookingId={booking.bookingId}
                                onPaid={loadBooking}
                                className="flex-1"
                            />
                        )}

                        <Link
                            to="/bookings"
                            className="flex-1 rounded-xl bg-slate-900 px-6 py-3 text-center font-semibold text-white hover:bg-slate-800"
                        >
                            My Bookings
                        </Link>

                        <Link
                            to="/housing"
                            className="flex-1 rounded-xl border border-slate-200 px-6 py-3 text-center font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            Browse Housing
                        </Link>

                    </div>

                </div>
            </div>
        </div>
    );
}

function BookingInfo({
    icon,
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-5">

            <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                    {icon}
                </div>

                <div>
                    <p className="text-xs text-slate-500">
                        {label}
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                        {value}
                    </p>
                </div>

            </div>
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

export default BookingDetails;