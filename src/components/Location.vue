<template>
  <div v-if="address === ''"></div>
  <div
    v-else-if="address === 'Não encontrado'"
    class="alert alert-primary"
    role="alert"
  >
    <i class="fas fa-map-marker-alt"></i>
    <b style="padding: 5px">{{ notFoundMessage }}</b>
    <span class="badge badge-secondary">{{ code }}</span>
  </div>
  <div v-else class="alert alert-primary" role="alert">
    <i class="fas fa-map-marker-alt"></i>
    <b style="padding: 5px">{{ prefixMessage }}</b>
    <span class="badge badge-primary">{{ code }}</span>
    <span style="padding: 5px">{{ address }}</span>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Location",
  props: {
    prefixMessage: {
      type: String,
      default: "Você está aqui:",
    },
    notFoundMessage: {
      type: String,
      default: "Código não encontrado:",
    },
  },
  computed: mapState({
    address: (state) => state.address,
    code: (state) => state.code,
  }),
};
</script>