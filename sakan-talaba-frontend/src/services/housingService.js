import api from "./api";

// ============================================================
// Helpers
// ============================================================

const cleanParams = (params = {}) => {
  const cleaned = { ...params };

  Object.keys(cleaned).forEach((key) => {
    const value = cleaned[key];

    if (
      value === "" ||
      value === null ||
      value === undefined
    ) {
      delete cleaned[key];
    }
  });

  return cleaned;
};

// ============================================================
// Get Housing List / Search
// GET /api/Housings/search
// ============================================================

export const getHousings = async (
  filters = {},
  page = 1,
  pageSize = 20
) => {
  const params = cleanParams({
    page,
    pageSize,

    universityId: filters.universityId,
    minPrice: filters.minPrice,
    maxPrice: filters.maxPrice,
    maxDistance: filters.maxDistance,
    housingType: filters.housingType,
    roomType: filters.roomType,
    genderType: filters.genderType,
    amenities: filters.amenities,
    minimumRating: filters.minimumRating,
    sortBy: filters.sortBy,
    sortDirection: filters.sortDirection,
  });

  console.log("====================================");
  console.log("🏠 HOUSING SEARCH");
  console.log("URL:", "/Housings/search");
  console.log("PARAMS:", params);
  console.log("====================================");

  try {
    const response = await api.get(
      "/Housings/search",
      {
        params,
      }
    );

    console.log("====================================");
    console.log("✅ HOUSING SEARCH RESPONSE");
    console.log(response.data);
    console.log("====================================");

    const data = response.data;

    return {
      items: Array.isArray(data?.items)
        ? data.items
        : [],

      page: Number(data?.page ?? page),

      pageSize: Number(
        data?.pageSize ?? pageSize
      ),

      totalCount: Number(
        data?.totalCount ?? 0
      ),

      totalPages: Number(
        data?.totalPages ?? 0
      ),
    };
  } catch (error) {
    console.error(
      "❌ Housing Search Error:",
      error
    );

    console.error(
      "Response:",
      error?.response?.data
    );

    console.error(
      "Status:",
      error?.response?.status
    );

    throw error;
  }
};

// ============================================================
// Recommended Housing
//
// Dedicated recommendation endpoint
// ============================================================

export const getRecommendedHousing = async (
  filters = {},
  page = 1,
  pageSize = 6
) => {
  const params = new URLSearchParams({
    ...Object.fromEntries(Object.entries(filters).filter(([, value]) => value !== undefined && value !== "")),
    page,
    pageSize,
  });
  const { data } = await api.get(`/Housings/recommended?${params.toString()}`);
  return data;
};

// ============================================================
// Get Housing By ID
// GET /api/Housings/{id}
// ============================================================

export const getHousingById = async (id) => {
  if (!id) {
    throw new Error(
      "Housing ID is required."
    );
  }

  const response = await api.get(
    `/Housings/${id}`
  );

  return response.data;
};

// ============================================================
// Get Housing Types
// GET /api/Housings/types
// ============================================================

export const getHousingTypes = async () => {
  const response = await api.get(
    "/Housings/types"
  );

  console.log(
    "🏠 Housing Types:",
    response.data
  );

  return response.data;
};

// ============================================================
// Compare Housing
// GET /api/Housings/compare?ids=1,2,3
// ============================================================

export const compareHousings = async (
  ids = []
) => {
  if (
    !Array.isArray(ids) ||
    ids.length === 0
  ) {
    throw new Error(
      "At least one housing ID is required."
    );
  }

  const validIds = ids.filter(
    (id) =>
      id !== null &&
      id !== undefined &&
      id !== ""
  );

  const response = await api.get(
    "/Housings/compare",
    {
      params: {
        ids: validIds.join(","),
      },
    }
  );

  return response.data;
};

export const getNearbyHousing = async (
  universityId,
  radius = 2,
  page = 1,
  pageSize = 20
) => {
  if (!universityId) {
    throw new Error(
      "University ID is required."
    );
  }

  const response = await api.get(
    "/Housings/nearby",
    {
      params: {
        universityId,
        radius,
        page,
        pageSize,
      },
    }
  );

  const data =
    response?.data?.data ??
    response?.data ??
    {};

  return {
    items: Array.isArray(data?.items)
      ? data.items
      : [],

    page:
      data?.page ?? page,

    pageSize:
      data?.pageSize ?? pageSize,

    totalCount:
      data?.totalCount ?? 0,

    totalPages:
      data?.totalPages ?? 0,
  };
};