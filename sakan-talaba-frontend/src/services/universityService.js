import api from "./api";

// ============================================================
// Get Universities
// GET /api/Universities?page=1&pageSize=100
// ============================================================
export const getUniversities = async (
  page = 1,
  pageSize = 100
) => {
  try {
    const response = await api.get("/Universities", {
      params: {
        page,
        pageSize,
      },
    });

    console.log("=================================");
    console.log("UNIVERSITIES REQUEST");
    console.log("URL:", "/Universities");
    console.log("PARAMS:", {
      page,
      pageSize,
    });
    console.log("UNIVERSITIES RESPONSE:");
    console.log(response.data);
    console.log("=================================");

    const data = response.data;

    return {
      items: Array.isArray(data?.items)
        ? data.items
        : [],
      page: data?.page ?? page,
      pageSize: data?.pageSize ?? pageSize,
      totalCount: data?.totalCount ?? 0,
      totalPages: data?.totalPages ?? 0,
    };
  } catch (error) {
    console.error(
      "Failed to load universities:",
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
// Get University By ID
// GET /api/Universities/{id}
// ============================================================
export const getUniversityById = async (id) => {
  if (!id) {
    throw new Error("University ID is required.");
  }

  const response = await api.get(
    `/Universities/${id}`
  );

  return response.data;
};