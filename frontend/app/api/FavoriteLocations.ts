const API_URL = "http://localhost:5050/api/v1/favorite_locations";

async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const headers = {
        "Content-Type": "application/json",
        ...options.headers,
    };

    if (token) {
        (headers as any).Authorization = `Token ${token}`;
    }

    const res = await fetch(url, {...options, headers});

    if (!res.ok) {
        throw new Error(`Failed to fetch: ${res.statusText}`);
    }

    // Handle empty responses (e.g., 204 No Content for DELETE)
    const contentType = res.headers.get("content-type");
    if (res.status === 204 || !contentType || !contentType.includes("application/json")) {
        return null;
    }

    return res.json();
}

// GET /v1/favorite_locations/
export async function getFavoriteLocations() {
    return fetchWithAuth(`${API_URL}/`);
}

// POST /v1/favorite_locations/
export async function createFavoriteLocation(data: any) {
    return fetchWithAuth(`${API_URL}/`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// GET /v1/favorite_locations/detail/{id}/
export async function getFavoriteLocation(id: string) {
    return fetchWithAuth(`${API_URL}/detail/${id}/`);
}

// DELETE /v1/favorite_locations/detail/{id}/
export async function deleteFavoriteLocation(id: string) {
    return fetchWithAuth(`${API_URL}/detail/${id}/`, {
        method: "DELETE",
    });
}

// PUT /v1/favorite_locations/detail/{id}/
export async function updateFavoriteLocation(id: string, data: any) {
    return fetchWithAuth(`${API_URL}/detail/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}