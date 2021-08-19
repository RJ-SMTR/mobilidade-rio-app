<template>
  <div v-if="address === ''"></div>
  <div
    v-else-if="address === 'Não encontrado'"
    class="alert alert-primary"
    role="alert"
  >
    <i class="fas fa-map-marker-alt"></i>
    <b style="padding: 5px">{{ notFoundMessage }}</b>
    <h1>
      <span class="badge badge-secondary">{{ code }}</span>
    </h1>
  </div>
  <div v-else class="alert alert-primary" role="alert">
    <i class="fas fa-map-marker-alt"></i>
    <b style="padding: 5px">{{ prefixMessage }}</b>
    <span class="badge badge-primary even-larger-badge">{{ code }}</span>
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

<style scoped>
.badge.even-larger-badge {
  font-size: 1.05em;
}
</style>