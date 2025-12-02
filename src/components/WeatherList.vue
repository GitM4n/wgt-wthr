<script setup lang="ts">
import { computed, defineEmits, defineProps } from "vue";
import { mapToWeatherCard, getIconifyIconUrl } from "@/utils";
import type { CityWithWeatherId, WeatherApiResponse } from "@/types";
import WeatherCard from "./WeatherCard.vue";

const props = defineProps<{
  cities: CityWithWeatherId[];
  weatherData: WeatherApiResponse[];
}>();

const emit = defineEmits<{
  "go-to-settings": [];
}>();

const weatherCards = computed(() =>
  props.cities.map((city) => {
    const weather = props.weatherData.find((w) => w.id === city.weatherId);

    if (!weather)
      return {
        city: city,
        weather: null,
      };

    return mapToWeatherCard(city, weather);
  })
);
</script>

<template>
  <div class="weather">
    <button @click="emit('go-to-settings')">
      <img
        :src="getIconifyIconUrl('material-symbols:settings')"
        width="24"
        height="24"
      />
    </button>

    <ul v-if="weatherCards.length" class="weather-list">
      <li v-for="(card, index) in weatherCards" :key="index">
        <WeatherCard :card="card" />
      </li>
    </ul>

    <p v-else class="no-cities">
      No cities added yet. Add some in the settings.
    </p>
  </div>
</template>

<style lang="scss">
.weather {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.weather > button {
  align-self: flex-end;
}

.weather-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.no-cities {
  text-align: center;
}
</style>
