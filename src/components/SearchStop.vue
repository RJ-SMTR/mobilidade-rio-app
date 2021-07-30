<template>
  <div>
    <h5 class="text-primary text-center">
      <i class="fas fa-chevron-circle-right"></i> {{ question }}
    </h5>
    <div class="input-group">
      <input
        type="text"
        class="form-control text-center"
        aria-label="Código do Ponto de ônibus"
        aria-describedby="basic-addon2"
        maxlength="4"
        v-bind:placeholder="placeholder"
        v-model="code"
        v-on:input="handleChangeCode"
      />
      <!-- <div class="input-group-append">
        <button class="btn btn-primary" type="button">
          <i class="fas fa-search"></i>
        </button>
      </div> -->
    </div>
    <a
      @click="handleQrCodeClick"
      class="btn btn-primary btn-block mt-2 mb-2"
      href="#"
      ><i class="fas fa-qrcode"></i> {{ qrcode_message }}</a
    >
  </div>
</template>

<script>
export default {
  name: "SearchStop",
  props: {
    question: {
      type: String,
      default: "Qual ponto você quer ter mais informações?",
    },
    placeholder: {
      type: String,
      default: "Informe o Código do Ponto Ex.: AA99",
    },
    qrcode_message: {
      type: String,
      default: "Usar QRCode",
    },
  },
  data() {
    return {
      code: "",
    };
  },
  methods: {
    handleChangeCode() {
      this.code = this.code.toUpperCase();
      this.$store.dispatch("resetReadQrcode");
      this.$store.dispatch("updateCode", this.code);
      this.$store.dispatch("clearTrip");
      this.$store.dispatch("clearStops");
    },
    handleQrCodeClick() {
      this.$store.dispatch("setReadQrcode");
    },
  },
};
</script>

<style scoped>
</style>