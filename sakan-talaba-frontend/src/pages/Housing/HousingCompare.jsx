import { useEffect, useState } from "react";
import { ArrowLeft, Star, MapPin } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";

import {
    compareHousings,
} from "../../services/housingService";

function HousingCompare() {
    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const [housings, setHousings] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadComparison = async () => {
            try {
                setLoading(true);
                setError("");

                const idsParam =
                    searchParams.get("ids");

                if (!idsParam) {
                    setError(
                        "No housing selected for comparison."
                    );

                    setLoading(false);
                    return;
                }

                const ids = idsParam
                    .split(",")
                    .map(Number)
                    .filter(Boolean);

                if (!ids.length) {
                    throw new Error(
                        "Invalid housing IDs."
                    );
                }

                const response =
                    await compareHousings(ids);

                const data =
                    response?.data ??
                    response;

                setHousings(
                    Array.isArray(data)
                        ? data
                        : []
                );

            } catch (err) {
                console.error(
                    "Compare Error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to compare housing."
                );
            } finally {
                setLoading(false);
            }
        };

        loadComparison();
    }, [searchParams]);

    if (loading) {
        return (
            <div className="flex min-h-[500px] items-center justify-center">
                <p className="text-lg text-slate-500">
                    Loading comparison...
                </p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mx-auto max-w-4xl px-6 py-16 text-center">

                <p className="text-red-600">
                    {error}
                </p>

                <button
                    onClick={() => navigate(-1)}
                    className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white"
                >
                    Go Back
                </button>

            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-6 py-10">

            <div className="mx-auto max-w-7xl">

                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 flex items-center gap-2 text-blue-600 hover:text-blue-700"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <div className="mb-10">
                    <p className="font-semibold text-blue-600">
                        COMPARE
                    </p>

                    <h1 className="mt-2 text-3xl font-bold text-slate-900">
                        Compare Housing
                    </h1>

                    <p className="mt-2 text-slate-500">
                        Compare prices, ratings and locations.
                    </p>
                </div>

                {housings.length === 0 ? (
                    <div className="rounded-2xl bg-white p-12 text-center shadow-sm">
                        <p className="text-slate-500">
                            No housing found.
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-2xl bg-white shadow-sm">

                        <table className="min-w-full">

                            <thead>
                                <tr className="border-b bg-slate-50">

                                    <th className="p-5 text-left">
                                        Feature
                                    </th>

                                    {housings.map(
                                        (housing) => (
                                            <th
                                                key={
                                                    housing.housingId ??
                                                    housing.id
                                                }
                                                className="min-w-[220px] p-5 text-left"
                                            >
                                                {housing.title}
                                            </th>
                                        )
                                    )}

                                </tr>
                            </thead>

                            <tbody>

                                <tr className="border-b">
                                    <td className="p-5 font-semibold">
                                        Price
                                    </td>

                                    {housings.map(
                                        (housing) => (
                                            <td
                                                key={
                                                    housing.housingId ??
                                                    housing.id
                                                }
                                                className="p-5 font-bold text-blue-600"
                                            >
                                                {Number(
                                                    housing.price || 0
                                                ).toLocaleString()}{" "}
                                                EGP
                                            </td>
                                        )
                                    )}
                                </tr>

                                <tr className="border-b">
                                    <td className="p-5 font-semibold">
                                        Location
                                    </td>

                                    {housings.map(
                                        (housing) => (
                                            <td
                                                key={
                                                    housing.housingId ??
                                                    housing.id
                                                }
                                                className="p-5"
                                            >
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={16} />
                                                    {housing.city ||
                                                        "Unknown"}
                                                </div>
                                            </td>
                                        )
                                    )}
                                </tr>

                                <tr className="border-b">
                                    <td className="p-5 font-semibold">
                                        Rating
                                    </td>

                                    {housings.map(
                                        (housing) => (
                                            <td
                                                key={
                                                    housing.housingId ??
                                                    housing.id
                                                }
                                                className="p-5"
                                            >
                                                <div className="flex items-center gap-1">
                                                    <Star
                                                        size={16}
                                                        className="fill-yellow-400 text-yellow-400"
                                                    />

                                                    {Number(
                                                        housing.rating || 0
                                                    ).toFixed(1)}
                                                </div>
                                            </td>
                                        )
                                    )}
                                </tr>

                                <tr>
                                    <td className="p-5 font-semibold">
                                        Distance
                                    </td>

                                    {housings.map(
                                        (housing) => (
                                            <td
                                                key={
                                                    housing.housingId ??
                                                    housing.id
                                                }
                                                className="p-5"
                                            >
                                                {Number(
                                                    housing.distanceKm || 0
                                                ).toFixed(1)}{" "}
                                                km
                                            </td>
                                        )
                                    )}
                                </tr>

                            </tbody>
                        </table>

                    </div>
                )}

            </div>
        </div>
    );
}

export default HousingCompare;