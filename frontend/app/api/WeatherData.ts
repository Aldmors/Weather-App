// Client-side function to get weather data
export async function getWeatherData(lat: string, lon: string) {
    const res = await fetch(
        `http://localhost:5050/api/v1/weather/${lat}/${lon}/`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch weather data");
    }

    return res.json();
}

export async function getWeatherOverview(
    lat: string,
    lon: string,
    weather_date: string = ""
) {
    const res = await fetch(
        `http://localhost:5050/api/v1/weather/overview/${lat}/${lon}/${weather_date}/`
    );

    if (!res.ok) {
        throw new Error("Failed to fetch weather overview");
    }

    const data = await res.json();

    return data;
}