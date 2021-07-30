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
    trip_object: null,
    trips_on_route: [],
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
    reverse_stops: [],
    read_qrcode: false,
  },
  mutations: {
    setCode(state, code) {
      state.code = code
    },
    setTrip(state, trip) {
      state.trip = trip
    },
    setTripObject(state, trip_object) {
      state.trip_object = trip_object
    },
    setTripsOnRoute(state, trips_on_route) {
      state.trips_on_route = trips_on_route
    },
    setAddress(state, address) {
      state.address = address
    },
    setModes(state, modes) {
      state.modes = modes
    },
    setStops(state, stops) {
      state.stops = stops
    },
    setReverseStops(state, reverse_stops) {
      state.reverse_stops = reverse_stops
    },
    updateReadQrcode(state, read_qrcode) {
      state.read_qrcode = read_qrcode
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
      this.dispatch("fetchTripObject", trip);
      this.dispatch("fetchStops", trip);
    },
    updateTripObject({ commit }, trip_object) {
      commit('setTripObject', trip_object)
    },
    updateTripsOnRoute({ commit }, trips_on_route) {
      commit('setTripsOnRoute', trips_on_route)
      this.dispatch("fetchReverseStops", trips_on_route);
    },
    clearTrip({ commit }) {
      commit('setTrip', '');
      this.dispatch("clearTripObject");
      this.dispatch("clearTripsOnRoute");
      this.dispatch("clearStops");
      this.dispatch("clearReverseStops");
    },
    clearTripObject({ commit }) {
      commit('setTripObject', null);
    },
    clearTripsOnRoute({ commit }) {
      commit('setTripsOnRoute', []);
    },
    clearStops({ commit }) {
      commit('setStops', [])
    },
    clearReverseStops({ commit }) {
      commit('setReverseStops', [])
    },
    setReadQrcode({ commit, dispatch }) {
      commit('updateReadQrcode', true)
      dispatch('clearAll');
    },
    resetReadQrcode({ commit }) {
      commit('updateReadQrcode', false);
    },
    fetchTripObject({ dispatch }, trip) {
      axios
        .get(`https://api.mobilidade.rio/trip/` + trip)
        .then(({ data }) => {
          dispatch("updateTripObject", data);
          dispatch("fetchTripsOnRoute", data.route.id);
        })
        .catch(() => {
          dispatch("clearTripObject");
        });
    },
    fetchTripsOnRoute({ dispatch }, route_id) {
      axios
        .get(`https://api.mobilidade.rio/trip/?route_id=` + route_id)
        .then(({ data }) => {
          dispatch("updateTripsOnRoute", data.results);
        })
        .catch(() => {
          dispatch("clearTripsOnRoute");
        });
    },
    fetchStops({ commit }, trip_id) {
      function getStops(url) {
        axios
          .get(url)
          .then(({ data }) => {
            data.results.forEach((item) => {
              stops.push(item.stop.name);
            })
            if (data.next) {
              getStops(data.next)
            }
          })
      }
      let stops = []
      let url = `https://api.mobilidade.rio/sequence/?trip_id=` + trip_id
      getStops(url)
      commit('setStops', stops)
    },
    fetchReverseStops({ commit }, trips_on_route) {
      function getStops(url) {
        axios
          .get(url)
          .then(({ data }) => {
            data.results.forEach((item) => {
              reverse_stops.push(item.stop.name);
            })
            if (data.next) {
              getStops(data.next)
            }
          })
      }
      let reverse_stops = []
      let reverse_trip_id = trips_on_route[0].id === this.state.trip_object.id ? trips_on_route[1].id : trips_on_route[0].id
      let url = `https://api.mobilidade.rio/sequence/?trip_id=` + reverse_trip_id
      getStops(url)
      commit('setReverseStops', reverse_stops)
    },
    clearAddress({ commit }) {
      commit('setAddress', '')
    },
    clearModes({ commit }) {
      commit('setModes', { count: 0, onibus: [], metro: [], barca: [], trem: [], vlt: [] });
    },
    fetchAddress({ commit }, code) {
      axios
        .get(
          `https://api.mobilidade.rio/qrcode/?code=` + code
        )
        .then(({ data }) => {
          commit("setAddress", data.results[0].stop.name);
        })
        .catch(() => {
          commit("setAddress", "Não encontrado");
        });
    },
    fetchModes({ commit }, code) {
      function getModes(url) {
        axios
          .get(url)
          .then(({ data }) => {
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
            if (data.next) {
              getModes(data.next)
            }
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
      let url = `https://api.mobilidade.rio/trip/?code=` + code
      let modes = {
        count: 0,
        onibus: [],
        metro: [],
        barca: [],
        trem: [],
        vlt: [],
      }
      getModes(url)
      commit("setModes", modes);
    },
    clearAll({ dispatch }) {
      dispatch('clearAddress');
      dispatch('clearTrip');
      dispatch('clearTripObject');
      dispatch('clearTripsOnRoute');
      dispatch('clearStops');
      dispatch('clearReverseStops');
      dispatch('clearModes');
    }
  }
})

new Vue({
  render: h => h(App),
  store: store,
}).$mount('#app')
