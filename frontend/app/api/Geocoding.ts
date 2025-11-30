import {fetchWithAuth} from "./apiUtils";

export async function getCoordinatesByLocation(locationName: string) {
    return fetchWithAuth(`/geocoding/?q=${encodeURIComponent(locationName)}`);
}
