<template>
  <div class="section">
    <div class="container">
      <div class="main main-raised">
        <div class="row">
          <div class="col-md-12">
            <div class="py-1">
              <SearchStop />
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
import Separator from "./Separator.vue";
import Location from "./Location.vue";
import TripsList from "./TripsList.vue";
import TripDetails from "./TripDetails.vue";

export default {
  name: "Content",
  components: { SearchStop, Separator, Location, TripsList, TripDetails },
  mounted() {
    function getUrlParameter(sParam) {
      var sPageURL = window.location.search.substring(1);
      var sURLVariables = sPageURL.split("&");
      for (var i = 0; i < sURLVariables.length; i++) {
        var sParameterName = sURLVariables[i].split("=");
        if (sParameterName[0] == sParam) {
          return sParameterName[1];
        }
      }
    }

    let code = getUrlParameter("code");
    let trip = getUrlParameter("trip");
    if (code) {
      this.$store.dispatch("updateCode", code);
    }
    if (trip) {
      this.$store.dispatch("updateTrip", trip);
    }
  },
};
</script>
