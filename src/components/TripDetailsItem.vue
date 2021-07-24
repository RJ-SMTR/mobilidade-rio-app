<template>
  <li :class="`event ${stop === currentStop ? 'active' : ''}`">
    {{ stop }}
  </li>
</template>

<script>
export default {
  name: "TripDetailsItem",
  props: {
    stop: {
      type: String,
      required: true,
    },
    currentStop: {
      type: String,
      required: true,
    },
  },
};
</script>