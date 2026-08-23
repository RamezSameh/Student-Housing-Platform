import { useEffect, useState } from "react";
import {
    Heart,
    ArrowLeft,
    Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import HousingCard from "../../components/housing/HousingCard";

import {
    getFavorites,
    removeFavorite,
    clearFavorites,
} from "../../services/favoritesService";

function Favorites() {
    const navigate = useNavigate();

    const [favorites, setFavorites] =
        useState([]);

    const loadFavorites = () => {
        setFavorites(
            getFavorites()
        );
    };

    useEffect(() => {
        loadFavorites();

        const handleFavoritesChanged =
            () => {
                loadFavorites();
            };

        window.addEventListener(
            "favoritesChanged",
            handleFavoritesChanged
        );

        window.addEventListener(
            "storage",
            handleFavoritesChanged
        );

        return () => {
            window.removeEventListener(
                "favoritesChanged",
                handleFavoritesChanged
            );

            window.removeEventListener(
                "storage",
                handleFavoritesChanged
            );
        };
    }, []);

    const handleRemove = (
        housingId
    ) => {
        removeFavorite(housingId);

        loadFavorites();

        window.dispatchEvent(
            new Event("favoritesChanged")
        );
    };

    const handleClear = () => {
        clearFavorites();

        setFavorites([]);

        window.dispatchEvent(
            new Event("favoritesChanged")
        );
    };

    return (
        <div className="min-h-screen bg-slate-50">

            {/* Header */}
            <section className="bg-slate-950">
                <div className="mx-auto max-w-7xl px-6 py-14">

                    <p className="font-semibold text-blue-400">
                        SAVED HOMES
                    </p>

                    <h1 className="mt-2 text-4xl font-extrabold text-white">
                        My Favorites
                    </h1>

                    <p className="mt-3 text-slate-300">
                        Keep track of the housing options
                        you like.
                    </p>
                </div>
            </section>

            <main className="mx-auto max-w-7xl px-6 py-10">

                {/* Toolbar */}
                <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex items-center gap-3">

                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <Heart
                                size={22}
                                className="fill-current"
                            />
                        </div>

                        <div>
                            <p className="font-bold text-slate-900">
                                {favorites.length} Saved
                            </p>

                            <p className="text-sm text-slate-500">
                                Housing options
                            </p>
                        </div>
                    </div>

                    {favorites.length > 0 && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="flex items-center justify-center gap-2 rounded-lg border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50"
                        >
                            <Trash2 size={17} />

                            Clear All
                        </button>
                    )}
                </div>

                {/* Empty */}
                {favorites.length === 0 && (
                    <div className="rounded-2xl bg-white p-14 text-center shadow-sm">

                        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-red-400">
                            <Heart
                                size={36}
                            />
                        </div>

                        <h2 className="mt-6 text-2xl font-bold text-slate-900">
                            No Favorites Yet
                        </h2>

                        <p className="mx-auto mt-2 max-w-md text-slate-500">
                            Start browsing housing and
                            save the options you like.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/housing"
                                )
                            }
                            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            Browse Housing
                        </button>
                    </div>
                )}

                {/* Favorites */}
                {favorites.length > 0 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

                        {favorites.map(
                            (housing) => (
                                <div
                                    key={
                                        housing.id ??
                                        housing.housingId
                                    }
                                    className="relative"
                                >

                                    <HousingCard
                                        housing={
                                            housing
                                        }
                                    />

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleRemove(
                                                housing.id ??
                                                housing.housingId
                                            )
                                        }
                                        className="absolute bottom-24 right-5 z-10 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-red-500 shadow hover:bg-red-50"
                                    >
                                        Remove
                                    </button>
                                </div>
                            )
                        )}

                    </div>
                )}
            </main>
        </div>
    );
}

export default Favorites;