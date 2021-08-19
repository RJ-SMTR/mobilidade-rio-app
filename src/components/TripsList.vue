<template>
  <span v-if="address === '' || address === 'Não encontrado'" />
  <span v-else>
    <!-- BREADCRUMB -->
    <div aria-label="breadcrumb" class="mt-2">
      <ol class="breadcrumb">
        <li :class="`breadcrumb-item ${trip === '' ? 'active' : ''}`">
          <router-link
            :to="this.$route.fullPath.split(`/`).slice(0, 3).join(`/`)"
            ><i class="fas fa-grip-lines"></i> Linhas e Serviços</router-link
          >
        </li>
        <li :class="`breadcrumb-item ${trip !== '' ? 'active' : ''}`">
          <i class="fas fa-directions"></i>
          <span v-if="trip_object !== null" style="padding-left: 10px">
            <span class="badge badge-primary">
              {{ trip_object.route.short_name }}
            </span>
            {{ trip_object.route.vista }}
          </span>
          <span v-else>Itinerários</span>
        </li>
      </ol>
    </div>
    <!-- FIM BREADCRUMB -->

    <!-- INFO TRANSPORTE -->
    <div v-if="trip === ''" class="list-category-transport">
      <!-- INICIO METRO -->
      <div v-if="modes.metro.length > 0" class="category-transport">
        <div class="bg-modal p-2 border-top text-primary">
          <i class="fas fa-caret-right"></i>
          <strong>Metrô</strong>
        </div>
        <div class="list-group list-group-flush">
          <TripListItem
            v-for="trip in modes.metro"
            :key="trip.id"
            v-bind:trip="trip"
          />
        </div>
      </div>
      <!-- FIM METRO -->

      <!-- INICIO BUS -->
      <div v-if="modes.onibus.length > 0" class="category-transport">
        <div class="bg-modal p-2 border-top text-primary">
          <i class="fas fa-caret-right"></i>
          <strong>Ônibus</strong>
        </div>
        <div class="list-group list-group-flush">
          <TripListItem
            v-for="trip in modes.onibus"
            :key="trip.id"
            v-bind:trip="trip"
          />
        </div>
      </div>
      <!-- FIM BUS -->

      <!-- INICIO BARCA -->
      <div v-if="modes.barca.length > 0" class="category-transport">
        <div class="bg-modal p-2 border-top text-primary">
          <i class="fas fa-caret-right"></i>
          <strong>Barca</strong>
        </div>
        <div class="list-group list-group-flush"></div>
      </div>
      <!-- FIM BARCA -->

      <!-- INICIO TREM -->
      <div v-if="modes.trem.length > 0" class="category-transport">
        <div class="bg-modal p-2 border-top text-primary">
          <i class="fas fa-caret-right"></i>
          <strong>Trem</strong>
        </div>
        <div class="list-group list-group-flush"></div>
      </div>
      <!-- FIM TREM -->

      <!-- INICIO VLT -->
      <div v-if="modes.vlt.length > 0" class="category-transport">
        <div class="bg-modal p-2 border-top text-primary">
          <i class="fas fa-caret-right"></i>
          <strong>VLT</strong>
        </div>
        <div class="list-group list-group-flush"></div>
      </div>
      <!-- FIM VLT -->
    </div>
    <!-- FIM INFO TRANSPORTE -->
  </span>
</template>

<script>
import { mapState } from "vuex";
import TripListItem from "./TripListItem.vue";

export default {
  name: "TripsList",
  components: {
    TripListItem,
  },
  computed: mapState({
    address: (state) => state.address,
    modes: (state) => state.modes,
    trip: (state) => state.trip,
    trip_object: (state) => state.trip_object,
  }),
};
</script>