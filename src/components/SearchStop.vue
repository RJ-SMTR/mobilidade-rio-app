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
    <router-link to="/qrcode" class="btn btn-primary btn-block mt-2 mb-2">
      <i class="fas fa-qrcode"></i> {{ qrcode_message }}
    </router-link>
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
      if (this.code.length === 4) {
        this.$router.push("/ponto/" + this.code);
      }
    },
  },
};
</script>

<style scoped>
</style>