import {fetchWithAuth} from "./apiUtils";

// GET /v1/favorite_locations/
export async function getFavoriteLocations() {
    return fetchWithAuth(`/favorite_locations/`);
}

// POST /v1/favorite_locations/
export async function createFavoriteLocation(data: any) {
    return fetchWithAuth(`/favorite_locations/`, {
        method: "POST",
        body: JSON.stringify(data),
    });
}

// GET /v1/favorite_locations/detail/{id}/
export async function getFavoriteLocation(id: string) {
    return fetchWithAuth(`/favorite_locations/detail/${id}/`);
}

// DELETE /v1/favorite_locations/detail/{id}/
export async function deleteFavoriteLocation(id: string) {
    return fetchWithAuth(`/favorite_locations/detail/${id}/`, {
        method: "DELETE",
    });
}

// PUT /v1/favorite_locations/detail/{id}/
export async function updateFavoriteLocation(id: string, data: any) {
    return fetchWithAuth(`/favorite_locations/detail/${id}/`, {
        method: "PUT",
        body: JSON.stringify(data),
    });
}
