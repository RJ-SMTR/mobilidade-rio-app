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
              <ul class="timeline" id="sequenceIda">
                <span v-if="trips_on_route.length === 0"> Carregando... </span>
                <TripDetailsItem
                  v-for="stop in stops"
                  :key="stop"
                  v-bind:stop="stop"
                  v-bind:currentStop="address"
                />
              </ul>
            </div>
            <div
              class="tab-pane fade"
              id="classic-2"
              role="tabpanel"
              aria-labelledby="classic-2-tab"
            >
              <ul class="timeline" id="sequenceVolta">
                <span v-if="reverse_stops.length === 0"> Carregando... </span>
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

import TripDetailsItem from "./TripDetailsItem.vue";

export default {
  name: "TripDetails",
  components: {
    TripDetailsItem,
  },
  computed: mapState({
    address: (state) => state.address,
    trip: (state) => state.trip,
    trip_object: (state) => state.trip_object,
    trips_on_route: (state) => state.trips_on_route,
    stops: (state) => state.stops,
    reverse_stops: (state) => state.reverse_stops,
  }),
};
</script>