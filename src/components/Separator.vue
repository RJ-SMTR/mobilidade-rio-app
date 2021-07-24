<template>
  <div v-if="address === ''"></div>
  <hr v-else class="bg-secondary" />
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Separator",
  computed: mapState({
    address: (state) => state.address,
  }),
};
</script>
