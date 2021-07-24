import Vue from 'vue'
import Vuex from 'vuex'
import titleMixin from './mixins/titleMixin'
import axios from 'axios'
import App from './App.vue'

Vue.config.productionTip = false
Vue.prototype.$axios = axios
Vue.use(Vuex)
Vue.mixin(titleMixin)

// Global CSS
import './assets/css/custom.css'
import './assets/css/styles.css'

// FontAwesome
import './assets/vendor/fontawesome-free-5.15.3-web/css/all.css'
import './assets/vendor/fontawesome-free-5.15.3-web/js/all.min.js'

// Bootstrap 4.6.0 JS
import './assets/vendor/bootstrap-4.6.0/bootstrap.bundle.min.js'

// Vuex store
const store = new Vuex.Store({
  state: {
    code: '',
    trip: '',
    address: '',
    modes: {
      count: 0,
      onibus: [],
      metro: [],
      barca: [],
      trem: [],
      vlt: [],
    },
    stops: [],
  },
  mutations: {
    setCode(state, code) {
      state.code = code
    },
    setTrip(state, trip) {
      state.trip = trip
    },
    setAddress(state, address) {
      state.address = address
    },
    setModes(state, modes) {
      state.modes = modes
    },
    setStops(state, stops) {
      state.stops = stops
    }
  },
  actions: {
    updateCode({ commit }, code) {
      commit('setCode', code)
      if (code.length === 4) {
        this.dispatch("fetchAddress", code);
        this.dispatch("fetchModes", code);
      } else {
        this.dispatch("clearAddress");
      }
    },
    updateTrip({ commit }, trip) {
      commit('setTrip', trip)
      this.dispatch("fetchStops", trip);
    },
    clearTrip({ commit }) {
      commit('setTrip', '');
      this.dispatch("clearStops");
    },
    clearStops({ commit }) {
      commit('setStops', [])
    },
    fetchStops({ commit }, trip_id) {
      axios
        .get(`https://api.mobilidade.rio/sequence/?trip_id=` + trip_id)
        .then(({ data }) => {
          let stops = []
          data.results.forEach((item) => {
            stops.push(item.stop.address);
          })
          commit('setStops', stops)
        })
    },
    clearAddress({ commit }) {
      commit('setAddress', '')
    },
    fetchAddress({ commit }, code) {
      axios
        .get(
          `https://api.mobilidade.rio/qrcode/?code=` + code
        )
        .then(({ data }) => {
          commit("setAddress", data.results[0].stop.address);
        })
        .catch(() => {
          commit("setAddress", "Não encontrado");
        });
    },
    fetchModes({ commit }, code) {
      axios
        .get(
          `https://api.mobilidade.rio/trip/?code=` + code
        )
        .then(({ data }) => {
          var modes = {
            count: 0,
            onibus: [],
            metro: [],
            barca: [],
            trem: [],
            vlt: [],
          }
          data.results.forEach((item) => {
            modes.count += 1;
            if (item.route.mode.name == 'Ônibus') {
              modes.onibus.push(item);
            } else if (item.route.mode.name == 'Metrô') {
              modes.metro.push(item);
            } else if (item.route.mode.name == 'Barca') {
              modes.barca.push(item);
            } else if (item.route.mode.name == 'Trem') {
              modes.trem.push(item);
            } else if (item.route.mode.name == 'VLT') {
              modes.vlt.push(item);
            }
          })
          commit("setModes", modes);
        })
        .catch(() => {
          commit("setModes", {
            onibus: [],
            metro: [],
            barca: [],
            trem: [],
            vlt: [],
          });
        });
    }
  }
})

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
