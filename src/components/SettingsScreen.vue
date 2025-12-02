<script setup lang="ts">
import { ref, defineEmits } from "vue";
import type { CityGeocodeApiResponse } from "@/types";
import { fetchCities } from "@/api";
import { useWeatherWidget } from "@/composables/useWeatherWidget";
import { getIconifyIconUrl } from "@/utils";

const emit = defineEmits<{
  back: [];
}>();

const { cities, addCity, removeCity } = useWeatherWidget();

const query = ref("");
const foundCities = ref<CityGeocodeApiResponse[]>([]);

const draggedIndex = ref<number | null>(null);

async function findCity() {
  const [cityName, countryCode] = query.value.split(",").map((s) => s.trim());

  const result = await fetchCities(cityName, countryCode);

  if (result.length === 1) {
    await addCity(result[0]);
    query.value = "";
  } else foundCities.value = result;
}

async function addCityAndClear(city: CityGeocodeApiResponse) {
  foundCities.value = foundCities.value.filter(
    (c) => c.lat !== city.lat || c.lon !== city.lon
  );

  if (foundCities.value.length === 0) query.value = "";

  await addCity(city);
}

function clearCities() {
  foundCities.value = [];
  query.value = "";
}

function onDragStart(index: number) {
  draggedIndex.value = index;
}

function onDragOver(event: DragEvent, index: number) {
  event.preventDefault();
  const dragged = draggedIndex.value;
  if (dragged === null || dragged === index) return;

  const item = cities.value.splice(dragged, 1)[0];
  cities.value.splice(index, 0, item);
  draggedIndex.value = index;
}

function onDragEnd() {
  draggedIndex.value = null;
}
</script>

<template>
  <div class="settings">
    <button @click="emit('back')">
      <img
        :src="getIconifyIconUrl('material-symbols:arrow-back-rounded')"
        width="24"
        height="24"
      />
    </button>
    <ul class="sortable-list">
      <li
        v-for="(city, index) in cities"
        :key="city.lat + city.lon"
        class="sortable-list_item"
      >
        <button
          class="sortable-list_button"
          draggable="true"
          @dragstart="onDragStart(index)"
          @dragover="(e) => onDragOver(e, index)"
          @dragend="onDragEnd"
        >
          <img :src="getIconifyIconUrl('material-symbols:drag-indicator')" />
        </button>
        <h3>{{ city.name }}, {{ city.country }}, {{ city.state ?? "" }}</h3>
        <button @click="removeCity(city)">
          <img :src="getIconifyIconUrl('material-symbols:delete-outline')" />
        </button>
      </li>
    </ul>

    <div class="search-city">
      <label for="city-search"
        >Search city. Example: London, US(optional)</label
      >
      <input
        id="city-search"
        v-model="query"
        type="text"
        placeholder="City, CountryCode(optional)"
        @keyup.enter="findCity"
      />
      <button @click="findCity">Search</button>
    </div>

    <div v-if="foundCities.length" class="found-cities">
      <p>Found more than one city:</p>
      <ul class="found-cities">
        <li
          v-for="city in foundCities"
          :key="city.lat + city.lon"
          class="finded-city"
        >
          <div>{{ city.name }}, {{ city.country }}, {{ city.state ?? "" }}</div>
          <button @click="addCityAndClear(city)">Add</button>
        </li>
      </ul>
      <button @click="clearCities">Clear</button>
    </div>
  </div>
</template>

<style lang="scss">
button {
  cursor: pointer;
  border: none;
  background: none;
}

.settings > button {
  margin-bottom: 0.6rem;
}

.sortable-list {
  list-style: none;
  padding: 0;
  margin: 0 0 1rem 0;

  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  &_item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;

    background: #ffffff;
    border: 1px solid #a3a3a3;
    border-radius: 0.5rem;
    padding: 0.3rem;

    transition: background 0.2s ease, box-shadow 0.2s ease;

    &.dragging {
      background: #e9f2ff;
      box-shadow: 0 0 8px rgba(47, 112, 193, 0.3);
    }
  }

  &_button {
    cursor: grab;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0.25rem;

    display: flex;
    align-items: center;
    justify-content: center;

    border-radius: 0.4rem;
    transition: background 0.2s ease;

    &:hover {
      background: #f0f0f0;
    }

    &:active {
      cursor: grabbing;
      background: #e6e6e6;
    }

    img {
      width: 1.25rem;
      height: 1.25rem;
    }
  }

  h3 {
    flex: 1;
    font-size: 0.9rem;
    font-weight: 600;
    margin: 0;
  }

  /* delete button inside item */
  button:last-child {
    padding: 0.3rem;
    border-radius: 0.4rem;
    transition: background 0.2s ease;

    &:hover {
      background: #ffecec;
    }

    img {
      width: 1.2rem;
      height: 1.2rem;
    }
  }
}

/* SEARCH BLOCK */
.search-city {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  max-width: 320px;
  margin-bottom: 1rem;

  label {
    font-size: 0.85rem;
    opacity: 0.8;
  }

  input {
    padding: 0.6rem 0.8rem;
    border-radius: 0.4rem;
    border: 1px solid #bcbcbc;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #d6d6d6;
      box-shadow: 0 0 0 2px rgba(214, 214, 214, 0.25);
    }
  }

  button {
    padding: 0.5rem 0.8rem;
    background: #00a86b;
    color: #fff;
    border-radius: 0.4rem;
    font-size: 0.9rem;

    transition: background 0.2s ease;

    &:hover {
      background: #008152;
    }
  }
}

/* FOUND CITIES LIST */
.found-cities {
  padding-left: 0;

  button {
    padding: 0.35rem 0.7rem;
    background: #cf4e4a;
    border-radius: 0.3rem;
    color: #fff;
    font-size: 0.85rem;

    &:hover {
      background: #b94642;
    }
  }

  li {
    background: #fafafa;
    border: 1px solid #e0e0e0;
    padding: 0.6rem;
    border-radius: 0.4rem;
    margin-bottom: 0.4rem;

    display: flex;
    align-items: center;
    justify-content: space-between;

    button {
      padding: 0.35rem 0.7rem;
      background: #00a86b;
      border-radius: 0.3rem;
      color: #fff;
      font-size: 0.85rem;

      &:hover {
        background: #008b56;
      }
    }
  }
}
</style>
