const API_URL = "http://localhost:5050/api/v1/geocoding";

export async function getCoordinatesByLocation(locationName: string) {
    const res = await fetch(`${API_URL}/?q=${encodeURIComponent(locationName)}`);

    if (!res.ok) {
        throw new Error("Failed to fetch coordinates");
    }

    return res.json();
}

