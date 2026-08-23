const FAVORITES_KEY = "sakan-talaba-favorites";

// ============================================================
// Get all favorites
// ============================================================
export const getFavorites = () => {
    try {
        const stored = localStorage.getItem(
            FAVORITES_KEY
        );

        if (!stored) {
            return [];
        }

        const parsed = JSON.parse(stored);

        return Array.isArray(parsed)
            ? parsed
            : [];
    } catch (error) {
        console.error(
            "Failed to load favorites:",
            error
        );

        return [];
    }
};

// ============================================================
// Save favorites
// ============================================================
const saveFavorites = (favorites) => {
    localStorage.setItem(
        FAVORITES_KEY,
        JSON.stringify(favorites)
    );
};

// ============================================================
// Check if housing is favorite
// ============================================================
export const isFavorite = (housingId) => {
    if (!housingId) {
        return false;
    }

    const favorites = getFavorites();

    return favorites.some(
        (item) =>
            String(
                item.id ??
                item.housingId
            ) === String(housingId)
    );
};

// ============================================================
// Add favorite
// ============================================================
export const addFavorite = (housing) => {
    if (!housing) {
        return getFavorites();
    }

    const housingId =
        housing.id ??
        housing.housingId;

    if (!housingId) {
        return getFavorites();
    }

    const favorites = getFavorites();

    const exists = favorites.some(
        (item) =>
            String(
                item.id ??
                item.housingId
            ) === String(housingId)
    );

    if (exists) {
        return favorites;
    }

    const updated = [
        ...favorites,
        {
            ...housing,
            id: housingId,
        },
    ];

    saveFavorites(updated);

    return updated;
};

// ============================================================
// Remove favorite
// ============================================================
export const removeFavorite = (
    housingId
) => {
    const favorites = getFavorites();

    const updated = favorites.filter(
        (item) =>
            String(
                item.id ??
                item.housingId
            ) !== String(housingId)
    );

    saveFavorites(updated);

    return updated;
};

// ============================================================
// Toggle favorite
// ============================================================
export const toggleFavorite = (
    housing
) => {
    if (!housing) {
        return getFavorites();
    }

    const housingId =
        housing.id ??
        housing.housingId;

    if (!housingId) {
        return getFavorites();
    }

    if (isFavorite(housingId)) {
        return removeFavorite(housingId);
    }

    return addFavorite(housing);
};

// ============================================================
// Clear all
// ============================================================
export const clearFavorites = () => {
    localStorage.removeItem(
        FAVORITES_KEY
    );

    return [];
};