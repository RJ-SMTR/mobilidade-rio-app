<template>
  <span id="app" class="bg-light page">
    <Navbar />
    <Content />
    <Footer />
  </span>
</template>

<script>
import Navbar from "./components/Navbar.vue";
import Content from "./components/Content.vue";
import Footer from "./components/Footer.vue";

export default {
  name: "App",
  title: "Mobilidade Rio",
  components: {
    Navbar,
    Content,
    Footer,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
