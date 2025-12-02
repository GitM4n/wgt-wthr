import type {
  CityWithWeatherId,
  WeatherApiResponse,
  CityGeocodeApiResponse,
  WeatherCard,
} from "@/types";

import { CITIES_STORAGE_KEY } from "@/lib/constants";

export function getWindDirection(deg: number): string {
  const directions = [
    "N",
    "NNE",
    "NE",
    "ENE",
    "E",
    "ESE",
    "SE",
    "SSE",
    "S",
    "SSW",
    "SW",
    "WSW",
    "W",
    "WNW",
    "NW",
    "NNW",
  ];

  const WIND_SECTOR_SIZE = 360 / directions.length; // 22.5
  const WIND_DIRECTIONS_COUNT = directions.length; // 16

  const index = Math.round(deg / WIND_SECTOR_SIZE) % WIND_DIRECTIONS_COUNT;
  return directions[index];
}

export async function getUserLocation(): Promise<{
  lat: number;
  lon: number;
} | null> {
  if (!navigator.geolocation) return null;

  try {
    const position = await new Promise<GeolocationPosition>(
      (resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        });
      }
    );

    return {
      lat: position.coords.latitude,
      lon: position.coords.longitude,
    };
  } catch (error) {
    console.error(error);
    alert("Cannot detect your location. Please add a city manually.");
    return null;
  }
}

function windToText(speed: number) {
  if (speed < 1) return "Calm";
  if (speed < 5) return "Light breeze";
  if (speed < 11) return "Moderate breeze";
  if (speed < 19) return "Strong breeze";
  return "Storm";
}

export function mapToWeatherCard(
  city: CityWithWeatherId,
  weather: WeatherApiResponse
): WeatherCard {
  const temp = weather.main.temp;
  const humidity = weather.main.humidity;

  const dewPoint = temp - (100 - humidity) / 5;

  return {
    city: {
      name: city.name,
      country: city.country,
      state: city.state ?? "",
    },
    weather: {
      description: weather.weather[0]?.description ?? "",
      icon: weather.weather[0]?.icon ?? "",
      temperature: temp,
      feelsLike: weather.main.feels_like,
      wind: {
        direction: getWindDirection(weather.wind.deg),
        speed: weather.wind.speed,
        text: windToText(weather.wind.speed),
      },
      humidity,
      visibility: +(weather.visibility / 1000).toFixed(3),
      dewPoint: +dewPoint.toFixed(2),
      pressure: weather.main.pressure,
    },
  };
}

export function getIconifyIconUrl(iconName: string) {
  return `https://api.iconify.design/${iconName}.svg`;
}

export function getCachedCity(
  cityName: string,
  countryCode: string
): CityGeocodeApiResponse | null {
  if (!localStorage.getItem(CITIES_STORAGE_KEY)) return null;

  const cachedCities = JSON.parse(
    localStorage.getItem(CITIES_STORAGE_KEY) || "[]"
  );
  const matchedCity = cachedCities.find(
    (city: CityGeocodeApiResponse) =>
      city.name.toLowerCase() === cityName.toLowerCase() &&
      city.country.toLowerCase() === countryCode.toLowerCase()
  );
  if (matchedCity) return matchedCity as CityGeocodeApiResponse;

  return null;
}
