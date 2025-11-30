import {fetchWithAuth} from "./apiUtils";

// Client-side function to get weather data
export async function getWeatherData(lat: string, lon: string, location_place: string) {
    return fetchWithAuth(
        `/weather/${lat}/${lon}/${location_place}`
    );
}

export async function getWeatherOverview(
    lat: string,
    lon: string,
    weather_date: string = ""
) {
    return fetchWithAuth(
        `/weather/overview/${lat}/${lon}/${weather_date}/`
    );
}