<script setup lang="ts">
import type { WeatherCard } from "@/types";
import { computed, defineProps } from "vue";

const ICON_URL = "https://openweathermap.org/img/wn";

const props = defineProps<{
  card: WeatherCard;
}>();

function getIconUrl(icon: string) {
  return `${ICON_URL}/${icon}@2x.png`;
}

const themeClass = computed(() =>
  props.card.weather?.icon.includes("d") ? "" : "dark"
);
</script>

<template>
  <div class="card" :class="themeClass">
    <h3 class="card_title">
      {{ card.city.name }}, {{ card.city.country }}, {{ card.city.state ?? "" }}
    </h3>

    <template v-if="card.weather">
      <img
        class="card_icon"
        :src="getIconUrl(card.weather.icon)"
        :alt="card.weather.description"
      />

      <p class="card-desc">
        Feels like:
        {{ card.weather.feelsLike }}°C.
        <span class="capitalize">{{ card.weather.description }}</span
        >.
        {{ card.weather.wind.text }}
      </p>

      <dl class="definition-list">
        <div class="definition-list_item">
          <dt>Temperature:</dt>
          <dd>{{ card.weather.temperature }}°C</dd>
        </div>

        <div class="definition-list_item">
          <dt>Humidity:</dt>
          <dd>{{ card.weather.humidity }} %</dd>
        </div>

        <div class="definition-list_item">
          <dt>Wind:</dt>
          <dd>
            {{ card.weather.wind.speed }} m/s, {{ card.weather.wind.direction }}
          </dd>
        </div>

        <div class="definition-list_item">
          <dt>Pressure:</dt>
          <dd>{{ card.weather.pressure }} hPa</dd>
        </div>

        <div class="definition-list_item">
          <dt>Visibility:</dt>
          <dd>{{ card.weather.visibility }} km</dd>
        </div>

        <div class="definition-list_item">
          <dt>Dew point:</dt>
          <dd>{{ card.weather.dewPoint }}°C</dd>
        </div>
      </dl>
    </template>

    <p v-else class="no-weather-data">
      No Weather data. You can try add city again
    </p>
  </div>
</template>
<style lang="scss">
li {
  list-style: none;
}

.card {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  background-color: #ffffff;
  border: 1px solid #a3a3a3;
  &_title {
    text-align: center;
    font-weight: 700;
  }
  &_icon {
    width: 7rem;
    height: 7rem;
    margin: 0 auto;
  }
}

.capitalize {
  text-transform: capitalize;
}

.definition-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 0.5rem;
  background-color: #f4f4f4;
  border: 1px solid #a3a3a3;
  &_item {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}

.card.dark {
  background-color: #1f1f1f;
  color: #fff;
  border: none;
}

.dark .definition-list {
  background-color: #292929;
  color: #fff;
}

.definition-list dd {
  font-weight: 700;
}

.no-weather-data {
  text-align: center;
  font-size: 1.2rem;
  font-weight: 700;
}
</style>
