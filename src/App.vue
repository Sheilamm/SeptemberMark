<template>
  <div id="app">
    <ShowDown v-model="value" />
  </div>
</template>

<script>
import ShowDown from "./components/ShowDown.vue";

export default {
  name: "App",
  components: {
    ShowDown,
  },
  data() {
    return {
      value: "牛逼",
    };
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
}
* {
  padding: 0px;
  margin: 0px;
}
</style>
