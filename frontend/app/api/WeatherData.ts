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


// Client-side function to get weather data
export async function getWeatherData(lat: string, lon: string, location_place: string) {
    return fetchWithAuth(
        `http://localhost:5050/api/v1/weather/${lat}/${lon}/${location_place}`
    );
}

export async function getWeatherOverview(
    lat: string,
    lon: string,
    weather_date: string = ""
) {
    return fetchWithAuth(
        `http://localhost:5050/api/v1/weather/overview/${lat}/${lon}/${weather_date}/`
    );
}