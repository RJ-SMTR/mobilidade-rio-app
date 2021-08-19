import Vue from 'vue'
import titleMixin from './mixins/titleMixin'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.mixin(titleMixin)

// Global CSS
import './assets/css/custom.css'
import './assets/css/styles.css'

// FontAwesome
import './assets/vendor/fontawesome-free-5.15.3-web/css/all.css'
import './assets/vendor/fontawesome-free-5.15.3-web/js/all.min.js'

// Bootstrap 4.6.0 JS
import './assets/vendor/bootstrap-4.6.0/bootstrap.bundle.min.js'

new Vue({
  render: h => h(App),
  store: store,
  router: router,
  watch: {
    $route: function (to, from) {
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
    }
  }
}).$mount('#app')
