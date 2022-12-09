<template>
  <router-link
    :to="$route.fullPath + `/rota/` + trip.id"
    class="list-group-item d-flex align-items-center list-group-item-action"
  >
    <span class="badge badge badge-primary even-larger-badge">
      {{ trip.route.short_name }}
    </span>
     
    <!-- <img :src="icon" class="border border-warning rounded" /> -->
    <div v-if="trip.headsign != 0" class="w-75" style="text-align: left; padding-left: 5px">
      {{ trip.route.vista + ` (sentido ` + trip.headsign + `)` }}
    </div>
    <div v-else class="w-75" style="text-align: left; padding-left: 5px">
      {{ trip.route.vista + ` (sentido Circular )` }}
    </div>

    <!-- <div class="text-right">
      <span class="small"><i class="far fa-clock"></i> 50min</span>
      <span class="badge badge-light badge-pill">Expresso</span>
    </div> -->
  </router-link>
</template>

<script>
export default {
  name: "TripListItem",
  props: {
    trip: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      mode: "",
      icon: null,
    };
  },
  mounted() {
    switch (this.trip.route.mode.name) {
      case "Ônibus":
        this.mode = "onibus";
        break;
      case "Metrô":
        this.mode = "metro";
        break;
      case "Barca":
        this.mode = "barca";
        break;
      case "Trem":
        this.mode = "trem";
        break;
      case "VLT":
        this.mode = "vlt";
        break;
      default:
        this.mode = "onibus";
    }
    this.icon = require(`../assets/img/modal/${this.mode}.png`);
  },
};
</script>

<style scoped>
.badge.even-larger-badge {
  font-size: 1.05em;
}
</style>