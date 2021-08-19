<template>
  <li
    v-if="!toggle"
    :class="`event ${stop === currentStop ? 'active' : ''}`"
    style="font-size: 16px"
  >
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
    toggle: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
};
</script>