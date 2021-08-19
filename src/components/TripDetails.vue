<template>
  <div
    v-if="trip !== '' && address !== ''"
    class="timeline-category-transport classic-tab-wrap"
  >
    <div class="card">
      <div class="card-body">
        <div class="tab-wrap">
          <ul class="nav nav-tabs" id="classicTab" role="tablist">
            <li class="nav-item">
              <a
                class="nav-link active"
                id="classic-1-tab"
                data-toggle="tab"
                href="#classic-1"
                role="tab"
                aria-controls="classic-1"
                aria-selected="true"
                ><i class="fas fa-arrow-circle-right"></i>
                <span v-if="trips_on_route.length > 0">
                  {{ trip_object.headsign }}
                </span>
                <span v-else> IDA </span>
              </a>
            </li>
            <li class="nav-item">
              <a
                class="nav-link"
                id="classic-2-tab"
                data-toggle="tab"
                href="#classic-2"
                role="tab"
                aria-controls="classic-2"
                aria-selected="false"
                ><i class="fas fa-arrow-circle-left"></i>
                <span v-if="trips_on_route.length > 0">
                  {{
                    trip_object.id === trips_on_route[0].id
                      ? trips_on_route[1].headsign
                      : trips_on_route[0].headsign
                  }}
                </span>
                <span v-else> VOLTA </span>
              </a>
            </li>
          </ul>
          <div class="tab-content" id="classicTabContent">
            <div
              class="tab-pane fade show active"
              id="classic-1"
              role="tabpanel"
              aria-labelledby="classic-1-tab"
            >
              <pulse-loader
                :loading="!stops_ok"
                :color="`#0275d8`"
                :size="`10px`"
              ></pulse-loader>
              <p v-if="!stops_ok">Carregando...</p>
              <span v-if="trips_on_route.length > 0">
                <a href="#" @click="toggleStopsBefore()">{{
                  toggle_stops_before
                    ? "Mostrar paradas anteriores"
                    : "Esconder paradas anteriores"
                }}</a>
              </span>
              <ul class="timeline" id="sequenceIda">
                <TripDetailsItem
                  v-for="stop in stops_before"
                  :key="stop"
                  :stop="stop"
                  :currentStop="address"
                  :toggle="toggle_stops_before"
                />
                <TripDetailsItem
                  v-for="stop in stops_after"
                  :key="stop"
                  :stop="stop"
                  :currentStop="address"
                />
              </ul>
            </div>
            <div
              class="tab-pane fade"
              id="classic-2"
              role="tabpanel"
              aria-labelledby="classic-2-tab"
            >
              <pulse-loader
                :loading="!reverse_stops_ok"
                :color="`#0275d8`"
                :size="`10px`"
              ></pulse-loader>
              <p v-if="!reverse_stops_ok">Carregando...</p>
              <ul class="timeline" id="sequenceVolta">
                <TripDetailsItem
                  v-for="stop in reverse_stops"
                  :key="stop"
                  v-bind:stop="stop"
                  v-bind:currentStop="address"
                />
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import PulseLoader from "vue-spinner/src/PulseLoader.vue";

import TripDetailsItem from "./TripDetailsItem.vue";

export default {
  name: "TripDetails",
  components: {
    TripDetailsItem,
    PulseLoader,
  },
  data() {
    return {
      stops_before: [],
      stops_after: [],
      toggle_stops_before: true,
    };
  },
  computed: mapState({
    address: (state) => state.address,
    trip: (state) => state.trip,
    trip_object: (state) => state.trip_object,
    trips_on_route: (state) => state.trips_on_route,
    stops: (state) => state.stops,
    stops_ok: (state) => state.stops_ok,
    reverse_stops: (state) => state.reverse_stops,
    reverse_stops_ok: (state) => state.reverse_stops_ok,
  }),
  watch: {
    stops(newStops, oldStops) {
      let stops_before = [];
      let stops_after = [];
      if (newStops.length > 0) {
        let currentStopIndex = newStops.findIndex((stop) => {
          return stop === this.address;
        });
        if (currentStopIndex > 0) {
          stops_before = newStops.slice(0, currentStopIndex);
          stops_after = newStops.slice(currentStopIndex);
        } else {
          stops_before = newStops.slice(0);
          stops_after = [];
        }
      }
      this.stops_before = stops_before;
      this.stops_after = stops_after;
    },
  },
  methods: {
    toggleStopsBefore() {
      this.toggle_stops_before = !this.toggle_stops_before;
    },
  },
};
</script>