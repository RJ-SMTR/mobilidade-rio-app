import Vue from 'vue'
import Vuex from 'vuex'
import axiosClient from 'axios'

let baseURL = '';
if(window.location.hostname === 'mobilidade.rio') {
    baseURL = 'https://api.mobilidade.rio/'
} else if(window.location.hostname === 'app.staging.mobilidade.rio') {
    baseURL = 'https://api.staging.mobilidade.rio/'
}

const axios = axiosClient.create({baseURL});

Vue.use(Vuex)

// Vuex store
export default new Vuex.Store({
  state: {
    code: '',
    trip: '',
    teste: 'xpto',
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
    modes_ok: false,
    stops: [],
    stops_ok: false,
    reverse_stops: [],
    reverse_stops_ok: false,
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
    setModesOk(state, modes_ok) {
      state.modes_ok = modes_ok
    },
    setStops(state, stops) {
      state.stops = stops
    },
    setStopsOk(state, stops_ok) {
      state.stops_ok = stops_ok
    },
    setReverseStops(state, reverse_stops) {
      state.reverse_stops = reverse_stops
    },
    setReverseStopsOk(state, reverse_stops_ok) {
      state.reverse_stops_ok = reverse_stops_ok
    },
    updateReadQrcode(state, read_qrcode) {
      state.read_qrcode = read_qrcode
    }
  },
  actions: {
    updateCode({ commit }, code) {
      // axios.defaults.baseURL = `https://api.${(['7KKY', '7M9B'].includes(code.toUpperCase())?'staging.':'')}mobilidade.rio/`
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
      commit('setStopsOk', false)
    },
    clearReverseStops({ commit }) {
      commit('setReverseStops', [])
      commit('setReverseStopsOk', false)
    },
    setReadQrcode({ commit, dispatch }) {
      commit('updateReadQrcode', true)
      dispatch('clearAll');
    },
    resetReadQrcode({ commit }) {
      commit('updateReadQrcode', false);
    },
    fetchTripObject({ dispatch }, trip, code) {
      console.log(code)
      axios
        .get(`trip/` + trip)
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
        .get(`trip/?route_id=` + route_id)
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
            else {
              commit('setStopsOk', true)
            }
          })
      }
      let stops = []
      let url = `sequence/?trip_id=` + trip_id
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
            else {
              commit('setReverseStopsOk', true)
            }
          })
      }
      let reverse_stops = []
      let reverse_trip_id = trips_on_route[0].id === this.state.trip_object.id ? trips_on_route[1].id : trips_on_route[0].id
      let url = `sequence/?trip_id=` + reverse_trip_id
      getStops(url)
      commit('setReverseStops', reverse_stops)
    },
    clearAddress({ commit }) {
      commit('setAddress', '')
    },
    clearModes({ commit }) {
      commit('setModes', { count: 0, onibus: [], metro: [], barca: [], trem: [], vlt: [] });
      commit('setModesOk', false);
    },
    fetchAddress({ commit }, code) {
      axios
        .get(
          `qrcode/?code=` + code
        )
        .then(({ data }) => {
          commit("setAddress", data.results[0].stop.name);
        })
        .catch(() => {
          commit("setAddress", "Não encontrado");
        });
    },
    fetchModes({ commit }, code) {
      function getModes(url, previousModes = []) {
        axios
          .get(url)
          .then(({ data }) => {
            let hasLetters = []
            let regularStops = []
            let highwayStops = []
            previousModes.forEach((item) => {
              modes.count += 1;
              if (item.route.mode.name == 'Ônibus') {
                if (!/^\d/.test(item.route.short_name)){
                  hasLetters.push(item)
                 } else if (/^[2]/.test(item.route.short_name)){
                  highwayStops.push(item)
                 } else {
                  regularStops.push(item)
                 }
              } 
            })
            data.results.forEach((item) => {
              modes.count += 1;
              if (item.route.mode.name == 'Ônibus') {
                if (!/^\d/.test(item.route.short_name)) {
                  hasLetters.push(item)
                } else if (/^[2]/.test(item.route.short_name)){
                  highwayStops.push(item)
                } else {
                  regularStops.push(item)
                }
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
            modes.onibus = [...regularStops, ...highwayStops, ...hasLetters ];
            if (data.next) {
              getModes(data.next, modes.onibus)
            }
            else {
              commit('setModesOk', true)
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
            commit("setModesOk", false);
          });
      }
      let url = `trip/?code=` + code
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