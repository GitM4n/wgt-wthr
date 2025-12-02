import { WEATHER_API_KEY } from "@/lib/constants";
import type { CityGeocodeApiResponse } from "@/types";
import { getCachedCity } from "@/utils";

const CITY_API_URL = "http://api.openweathermap.org/geo/1.0/direct";

export async function fetchCities(
  cityName: string,
  countryCode?: string
): Promise<CityGeocodeApiResponse[]> {
  try {
    if (!cityName) return [];

    if (countryCode) {
      const cachedCity = getCachedCity(cityName, countryCode);
      if (cachedCity) return [cachedCity];
    }

    const url = new URL(CITY_API_URL);
    const q = countryCode ? `${cityName},${countryCode}` : cityName;
    url.searchParams.append("q", q);
    url.searchParams.append("appid", WEATHER_API_KEY);
    url.searchParams.append("limit", "5");

    const response = await fetch(url.toString());
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const data: CityGeocodeApiResponse[] = await response.json();

    if (countryCode) {
      const cityData = data.find(
        (city) =>
          city.name.toLowerCase() === cityName.toLowerCase() &&
          city.country.toLowerCase() === countryCode.toLowerCase()
      );
      if (cityData) return [cityData];
    }

    return data;
  } catch (error) {
    console.error("Error fetching city data:", error);
    return [];
  }
}
