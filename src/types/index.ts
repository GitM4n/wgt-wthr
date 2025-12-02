export type CityGeocodeApiResponse = {
  name: string;
  local_names: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
};

export type CityWithWeatherId = CityGeocodeApiResponse & {
  weatherId: number;
};

export type Weather = {
  id: number;
  main: string;
  description: string;
  icon: string;
};

export type WeatherApiResponse = {
  coord: {
    lon: number;
    lat: number;
  };

  weather: Weather[];

  base: string;

  main: {
    temp: number;
    feels_like: number;
    pressure: number;
    humidity: number;
    temp_min: number;
    temp_max: number;
    sea_level: number;
    grnd_level: number;
  };

  visibility: number;

  wind: {
    speed: number;
    deg: number;
    gust: number;
  };

  clouds: {
    all: number;
  };

  rain?: {
    "1h"?: number;
  };

  snow?: {
    "1h"?: number;
  };

  dt: number;

  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };

  timezone: number;
  id: number;
  name: string;
  cod: number;
};

export type WeatherCard = {
  city: {
    name: string;
    country: string;
    state?: string;
  };
  weather?: {
    description: string;
    icon: string;
    temperature: number;
    wind: {
      direction: string;
      speed: number;
      text: string;
    };
    humidity: number;
    visibility: number;
    dewPoint: number;
    feelsLike: number;
    pressure: number;
  } | null;
};
