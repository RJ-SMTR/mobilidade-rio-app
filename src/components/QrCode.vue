<template>
  <div>
    <p class="error">{{ error }}</p>
    <qrcode-stream @decode="onDecode" @init="onInit" />
  </div>
</template>

<script>
import { QrcodeStream } from "vue-qrcode-reader";

export default {
  components: { QrcodeStream },
  data() {
    return {
      result: "",
      error: "",
    };
  },
  methods: {
    onDecode(result) {
      this.result = result;
      if (result.startsWith("https://") && result.includes("mobilidade.rio")) {
        window.location.href = result;
      } else {
        this.error = `ERRO: A URL ` + result + ` não é válida!`;
      }
    },

    async onInit(promise) {
      try {
        await promise;
      } catch (error) {
        if (error.name === "NotAllowedError") {
          this.error = "ERRO: você precisa permitir acesso à câmera!";
        } else if (error.name === "NotFoundError") {
          this.error = "ERRO: não há câmera nesse dispositivo.";
        } else if (error.name === "NotSupportedError") {
          this.error = "ERRO: contexto seguro requirido (HTTPS, localhost)";
        } else if (error.name === "NotReadableError") {
          this.error = "ERRO: a câmera está em uso por outro aplicativo?";
        } else if (error.name === "OverconstrainedError") {
          this.error = "ERRO: as câmeras instaladas não são suportadas";
        } else if (error.name === "StreamApiNotSupportedError") {
          this.error = "ERRO: esse browser não é suportado";
        }
      }
    },
  },
};
</script>

<style scoped>
.error {
  font-weight: bold;
  color: red;
}
</style>
