<template>
  <a
    @click="handleItemClick"
    href="#"
    class="list-group-item d-flex align-items-center list-group-item-action"
  >
    <div class="badge badge-light p-0 mr-2">
      <img :src="icon" class="border border-warning rounded" />
    </div>
    <div class="w-75 small" style="text-align: left">
      {{
        trip.route.short_name +
        ` - ` +
        trip.route.vista +
        ` (sentido ` +
        trip.headsign +
        `)`
      }}
    </div>
    <!-- <div class="text-right">
      <span class="small"><i class="far fa-clock"></i> 50min</span>
      <span class="badge badge-light badge-pill">Expresso</span>
    </div> -->
  </a>
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
  methods: {
    handleItemClick() {
      this.$store.dispatch("updateTrip", this.trip.id);
    },
  },
};
</script>