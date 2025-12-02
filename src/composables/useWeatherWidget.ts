import { getWeather } from "@/api";

import { ref, onMounted, watch } from "vue";
import type {
  WeatherApiResponse,
  CityGeocodeApiResponse,
  CityWithWeatherId,
} from "@/types";
import { CITIES_STORAGE_KEY, WEATHER_API_KEY } from "@/lib/constants";
import { getUserLocation } from "@/utils";

const REVERSE_GEO_API_URL = "http://api.openweathermap.org/geo/1.0/reverse";

const weatherData = ref<WeatherApiResponse[]>([]);
const cities = ref<CityWithWeatherId[]>([]);

export function useWeatherWidget() {
  async function detectUserLocation() {
    const userLocation = await getUserLocation();
    if (!userLocation) return;

    const weather = await getWeather(userLocation.lat, userLocation.lon);
    if (!weather) return;

    const url = new URL(REVERSE_GEO_API_URL);
    url.searchParams.append("appid", WEATHER_API_KEY);
    url.searchParams.append("lat", userLocation.lat.toString());
    url.searchParams.append("lon", userLocation.lon.toString());

    const response = await fetch(url.toString());
    const data = await response.json();

    if (Array.isArray(data) && data.length > 0) {
      const city = data[0] as CityGeocodeApiResponse;

      const cityWithId = {
        ...city,
        weatherId: weather.id,
      } as CityWithWeatherId;

      if (!isCityExist(cityWithId)) {
        cities.value.push(cityWithId);
        weatherData.value.push(weather);
      }
    }
  }

  function isCityExist(city: CityWithWeatherId | CityGeocodeApiResponse) {
    return cities.value.some((c) => c.lat === city.lat && c.lon === city.lon);
  }

  function removeCity(city: CityWithWeatherId) {
    cities.value = cities.value.filter((c) => c.weatherId !== city.weatherId);
    weatherData.value = weatherData.value.filter(
      (w) => w.id !== city.weatherId
    );
  }

  async function addCity(city: CityGeocodeApiResponse) {
    if (isCityExist(city)) return;

    const weather = await getWeather(city.lat, city.lon);
    if (!weather) return;

    const idx = weatherData.value.findIndex((w) => w.id === weather.id);
    if (idx === -1) weatherData.value.push(weather);
    else weatherData.value[idx] = weather;

    cities.value.push({ ...city, weatherId: weather.id });
  }

  async function updateWeather(city: CityGeocodeApiResponse) {
    const weather = await getWeather(city.lat, city.lon);
    if (!weather) return;

    const idx = weatherData.value.findIndex((w) => w.id === weather.id);

    if (idx === -1) {
      weatherData.value.push(weather);
    } else {
      weatherData.value.splice(idx, 1, weather);
    }
  }

  onMounted(async () => {
    const cached = localStorage.getItem(CITIES_STORAGE_KEY);

    if (cached) {
      const cachedCities = JSON.parse(cached) as CityWithWeatherId[];

      for (const city of cachedCities) {
        const exists = cities.value.some(
          (c) => c.lat === city.lat && c.lon === city.lon
        );
        if (!exists) {
          cities.value.push(city);
        }
      }
    }

    for (const city of cities.value) {
      const weather = await getWeather(city.lat, city.lon);
      if (weather) updateWeather(city);
    }
  });

  watch(
    cities,
    (newCities) => {
      localStorage.setItem(CITIES_STORAGE_KEY, JSON.stringify(newCities));
    },
    { deep: true }
  );

  return {
    detectUserLocation,
    weatherData,
    cities,
    addCity,
    removeCity,
    isCityExist,
  };
}
