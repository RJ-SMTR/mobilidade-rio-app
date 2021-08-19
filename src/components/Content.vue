<template>
  <div class="section">
    <div class="container">
      <div class="main main-raised">
        <div class="row">
          <div class="col-md-12">
            <div class="py-1">
              <SearchStop />
              <QrCode v-if="read_qrcode" />
              <Separator />
              <Location />
              <TripsList />
              <TripDetails />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import SearchStop from "./SearchStop.vue";
import QrCode from "./QrCode.vue";
import Separator from "./Separator.vue";
import Location from "./Location.vue";
import TripsList from "./TripsList.vue";
import TripDetails from "./TripDetails.vue";
import { mapState } from "vuex";

export default {
  name: "Content",
  components: {
    SearchStop,
    QrCode,
    Separator,
    Location,
    TripsList,
    TripDetails,
  },
  mounted() {
    let to = this.$route;
    let route = to.fullPath;
    let params = to.params;
    let code = params.stop_id;
    let trip = params.trip_id;
    if (code) {
      this.$store.dispatch("updateCode", code.toUpperCase());
      this.$store.dispatch("clearTrip");
      this.$store.dispatch("clearStops");
    } else {
      this.$store.dispatch("updateCode", "");
      this.$store.dispatch("clearTrip");
      this.$store.dispatch("clearStops");
    }
    if (trip) {
      this.$store.dispatch("updateTrip", trip);
    }
    if (route === "/qrcode") {
      this.$store.dispatch("setReadQrcode");
    } else {
      this.$store.dispatch("resetReadQrcode");
    }
  },
  computed: {
    ...mapState({
      read_qrcode: (state) => state.read_qrcode,
    }),
  },
};
</script>
