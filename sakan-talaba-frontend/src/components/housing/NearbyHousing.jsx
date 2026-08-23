import { useEffect, useState } from "react";

import {
    MapPinned,
    Navigation,
    ArrowRight,
    LoaderCircle,
} from "lucide-react";

import {
    Link,
} from "react-router-dom";

import {
    getNearbyHousing,
} from "../../services/housingService";

import HousingCard from "./HousingCard";

function NearbyHousing({
    universityId,
    universityName = "",
}) {
    const [radius, setRadius] =
        useState(2);

    const [housing, setHousing] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        if (!universityId) {
            setHousing([]);
            return;
        }

        const loadNearby = async () => {
            try {
                setLoading(true);
                setError("");

                const result =
                    await getNearbyHousing(
                        universityId,
                        radius,
                        1,
                        6
                    );

                console.log(
                    "Nearby Housing:",
                    result
                );

                setHousing(
                    Array.isArray(result?.items)
                        ? result.items
                        : []
                );
            } catch (err) {
                console.error(
                    "Nearby Housing Error:",
                    err
                );

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load nearby housing."
                );

                setHousing([]);
            } finally {
                setLoading(false);
            }
        };

        loadNearby();
    }, [
        universityId,
        radius,
    ]);

    if (!universityId) {
        return null;
    }

    return (
        <section className="bg-white py-16">
            <div className="mx-auto max-w-7xl px-6">

                {/* Header */}
                <div className="mb-8 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">

                    <div>
                        <div className="flex items-center gap-2 text-blue-600">
                            <MapPinned size={20} />

                            <span className="text-sm font-semibold">
                                NEARBY HOUSING
                            </span>
                        </div>

                        <h2 className="mt-2 text-3xl font-bold text-slate-900">
                            Housing Near Your University
                        </h2>

                        {universityName && (
                            <p className="mt-2 text-slate-500">
                                Showing housing near{" "}
                                <span className="font-semibold text-slate-700">
                                    {universityName}
                                </span>
                            </p>
                        )}
                    </div>

                    {/* Radius */}
                    <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-2">

                        <Navigation
                            size={18}
                            className="ml-2 text-blue-600"
                        />

                        <select
                            value={radius}
                            onChange={(event) =>
                                setRadius(
                                    Number(
                                        event.target.value
                                    )
                                )
                            }
                            className="bg-transparent px-2 py-2 text-sm font-semibold text-slate-700 outline-none"
                        >
                            <option value="1">
                                Within 1 km
                            </option>

                            <option value="2">
                                Within 2 km
                            </option>

                            <option value="3">
                                Within 3 km
                            </option>

                            <option value="5">
                                Within 5 km
                            </option>

                            <option value="10">
                                Within 10 km
                            </option>
                        </select>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="flex min-h-52 items-center justify-center">
                        <div className="flex items-center gap-3 text-blue-600">
                            <LoaderCircle
                                size={22}
                                className="animate-spin"
                            />

                            <span className="font-medium">
                                Finding nearby housing...
                            </span>
                        </div>
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
                        {error}
                    </div>
                )}

                {/* Empty */}
                {!loading &&
                    !error &&
                    housing.length === 0 && (
                        <div className="rounded-2xl bg-slate-50 p-10 text-center">
                            <MapPinned
                                size={40}
                                className="mx-auto text-slate-300"
                            />

                            <h3 className="mt-4 font-bold text-slate-900">
                                No nearby housing found
                            </h3>

                            <p className="mt-2 text-sm text-slate-500">
                                Try increasing the search radius.
                            </p>
                        </div>
                    )}

                {/* Results */}
                {!loading &&
                    !error &&
                    housing.length > 0 && (
                        <>
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {housing.map(
                                    (item) => (
                                        <HousingCard
                                            key={
                                                item.housingId ??
                                                item.id
                                            }
                                            housing={item}
                                        />
                                    )
                                )}
                            </div>

                            <div className="mt-8 text-center">
                                <Link
                                    to={`/housing?universityId=${universityId}&maxDistance=${radius}`}
                                    className="inline-flex items-center gap-2 font-semibold text-blue-600 hover:text-blue-700"
                                >
                                    View All Nearby Housing

                                    <ArrowRight
                                        size={18}
                                    />
                                </Link>
                            </div>
                        </>
                    )}
            </div>
        </section>
    );
}

export default NearbyHousing;