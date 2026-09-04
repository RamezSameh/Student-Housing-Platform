import { useEffect, useState } from "react";

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Home,
    LoaderCircle,
    AlertCircle,
} from "lucide-react";

import {
    useNavigate,
    useSearchParams,
} from "react-router-dom";

import {
    createHousingBooking,
} from "../../services/bookingService";
import { useAuth } from "../../context/AuthContext";
import { getApiError } from "../../services/api";

function RequestBooking() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [searchParams] =
        useSearchParams();

    const housingRoomId =
        searchParams.get(
            "housingRoomId"
        );

    const housingTitle =
        searchParams.get(
            "housingTitle"
        ) || "Selected Housing";

    const [checkIn, setCheckIn] =
        useState("");


    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);
    const [form, setForm] = useState({
        nationalId: user?.nationalId || "",
        universityId: user?.universityId || "",
        studentName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
        mobile: user?.mobile || "",
        email: user?.email || "",
        durationMonths: 1,
        notes: "",
        paymentMethod: "CashOnArrival",
    });

    // ==========================================================
    // Validate Room
    // ==========================================================
    useEffect(() => {
        if (!housingRoomId) {
            setError(
                "No housing room was selected."
            );
        }
    }, [housingRoomId]);

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess(false);

        if (!housingRoomId) {
            setError(
                "No housing room was selected."
            );
            return;
        }

        if (!checkIn) {
            setError("Please select a move-in date.");
            return;
        }

        const startDate =
            new Date(checkIn);

        const duration = Number(form.durationMonths);

        if (
            Number.isNaN(
                startDate.getTime()
            ) ||
            !Number.isFinite(duration) || duration < 1
        ) {
            setError(
                "Please enter valid dates."
            );
            return;
        }

        try {
            setLoading(true);

            const result =
                await createHousingBooking({
                    housingRoomId:
                        Number(housingRoomId),

                    checkIn:
                        `${checkIn}T00:00:00`,

                    checkOut: `${new Date(startDate.setMonth(startDate.getMonth() + duration)).toISOString().slice(0, 10)}T00:00:00`,
                    ...form,
                    durationMonths: Number(form.durationMonths),
                });

            console.log(
                "Booking Created:",
                result
            );

            setSuccess(true);

            setTimeout(() => {
                navigate(
                    `/booking-confirmation/${result.bookingId}`
                );
            }, 1200);

        } catch (err) {
            console.error(
                "Create Booking Error:",
                err
            );

            setError(getApiError(err, "Failed to create booking."));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">

            <div className="mx-auto max-w-2xl">

                {/* Back */}
                <button
                    type="button"
                    onClick={() =>
                        navigate(-1)
                    }
                    className="mb-6 flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={18} />

                    Back
                </button>

                {/* Card */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm">

                    {/* Header */}
                    <div className="bg-slate-950 p-7">

                        <p className="text-sm font-semibold text-blue-400">
                            BOOKING REQUEST
                        </p>

                        <h1 className="mt-2 text-3xl font-extrabold text-white">
                            Request a Booking
                        </h1>

                        <p className="mt-2 text-slate-300">
                            Choose your stay dates for{" "}
                            <span className="font-semibold text-white">
                                {housingTitle}
                            </span>
                        </p>

                    </div>

                    {/* Form */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-7"
                    >

                        {/* Room */}
                        <div className="mb-6 rounded-xl bg-blue-50 p-4">

                            <div className="flex items-center gap-3">

                                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-blue-600">
                                    <Home size={21} />
                                </div>

                                <div>

                                    <p className="text-xs text-slate-500">
                                        Selected Housing Room
                                    </p>

                                    <p className="font-bold text-slate-900">
                                        {housingTitle}
                                    </p>

                                </div>

                            </div>
                        </div>

                        {/* Dates */}
                        <div className="grid gap-5 md:grid-cols-2">

                            {/* Check In */}
                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Check-in Date
                                </label>

                                <div className="relative">

                                    <CalendarDays
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600"
                                    />

                                    <input
                                        type="date"
                                        value={checkIn}
                                        onChange={(event) =>
                                            setCheckIn(
                                                event.target.value
                                            )
                                        }
                                        min={
                                            new Date()
                                                .toISOString()
                                                .split("T")[0]
                                        }
                                        className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="mt-6 grid gap-4 md:grid-cols-2">
                            {[
                                ["nationalId", "National ID"],
                                ["universityId", "University ID"],
                                ["studentName", "Full name"],
                                ["mobile", "Mobile"],
                                ["email", "Email"],
                            ].map(([name, label]) => (
                                <label key={name} className="block">
                                    <span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span>
                                    <input
                                        required
                                        type={name === "email" ? "email" : "text"}
                                        value={form[name]}
                                        onChange={(event) => setForm({ ...form, [name]: event.target.value })}
                                        className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    />
                                </label>
                            ))}
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">Duration (months)</span>
                                <input required min="1" max="120" type="number" value={form.durationMonths} onChange={(event) => setForm({ ...form, durationMonths: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3" />
                            </label>
                            <label className="block">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">Payment method</span>
                                <select value={form.paymentMethod} onChange={(event) => setForm({ ...form, paymentMethod: event.target.value })} className="w-full rounded-xl border border-slate-200 px-4 py-3">
                                    <option value="CashOnArrival">Cash on arrival</option>
                                    <option value="Stripe">Online payment</option>
                                </select>
                            </label>
                            <label className="block md:col-span-2">
                                <span className="mb-2 block text-sm font-semibold text-slate-700">Notes</span>
                                <textarea value={form.notes} onChange={(event) => setForm({ ...form, notes: event.target.value })} rows="3" className="w-full rounded-xl border border-slate-200 px-4 py-3" />
                            </label>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="mt-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">

                                <AlertCircle
                                    size={20}
                                    className="mt-0.5 shrink-0 text-red-500"
                                />

                                <p className="text-sm text-red-600">
                                    {error}
                                </p>

                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="mt-6 flex items-start gap-3 rounded-xl border border-green-200 bg-green-50 p-4">

                                <CheckCircle2
                                    size={20}
                                    className="mt-0.5 shrink-0 text-green-600"
                                />

                                <div>

                                    <p className="font-semibold text-green-700">
                                        Booking created successfully.
                                    </p>

                                    <p className="mt-1 text-sm text-green-600">
                                        Redirecting to your bookings...
                                    </p>

                                </div>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={
                                loading ||
                                success ||
                                !housingRoomId
                            }
                            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loading ? (
                                <>
                                    <LoaderCircle
                                        size={19}
                                        className="animate-spin"
                                    />

                                    Creating Booking...
                                </>
                            ) : (
                                <>
                                    <CalendarDays
                                        size={19}
                                    />

                                    Request Booking
                                </>
                            )}
                        </button>

                    </form>
                </div>
            </div>
        </div>
    );
}

export default RequestBooking;