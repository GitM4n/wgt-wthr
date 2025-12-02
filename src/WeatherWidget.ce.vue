<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useWeatherWidget } from "./composables/useWeatherWidget";
import WeatherList from "./components/WeatherList.vue";
import SettingsScreen from "./components/SettingsScreen.vue";

const { detectUserLocation, weatherData, cities } = useWeatherWidget();

const activeScreen = ref<"weather" | "settings">("weather");

onMounted(async () => {
  await detectUserLocation();
});
</script>
<template>
  <div class="container">
    <WeatherList
      v-if="activeScreen === 'weather'"
      :cities="cities"
      :weather-data="weatherData"
      @go-to-settings="activeScreen = 'settings'"
    />
    <SettingsScreen v-else @back="activeScreen = 'weather'" />
  </div>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 18rem;
  border-radius: 0.5rem;
  border: 1px solid #ccc;
  padding: 0.6rem;
  max-height: 100vh;
  min-height: 10rem;
  overflow-y: auto;
}
</style>
