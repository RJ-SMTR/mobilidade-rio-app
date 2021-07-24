<template>
  <footer class="footer mb-3">
    <div class="container">
      <div class="copyright text-center">
        <p class="text-muted">
          Desenvolvido pela
          <a href="https://prefeitura.rio" target="_BLANK">PCRJ</a> |
          <span class="badge badge-secondary">Versão {{ version }}</span>
        </p>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: "Footer",
  props: {},
  data() {
    return {
      version: "xxxx",
    };
  },
  mounted() {
    this.version = process.env.VUE_APP_GIT_HASH;
  },
};
</script>

<style>
</style>