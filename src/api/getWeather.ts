import { WEATHER_API_KEY } from "@/lib/constants";
import type { WeatherApiResponse } from "@/types";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherApiResponse | undefined> {
  try {
    const url = new URL(WEATHER_API_URL);
    url.searchParams.append("lat", lat.toString());
    url.searchParams.append("lon", lon.toString());
    url.searchParams.append("appid", WEATHER_API_KEY);
    url.searchParams.append("units", "metric");

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data: WeatherApiResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}
