<template>
  <div id="app">
    <!-- <MavonEditor /> -->
    <ShowDown />
  </div>
</template>

<script>
// import MavonEditor from './components/MavonEditor.vue';
import ShowDown from './components/ShowDown.vue';

export default {
  name: 'App',
  components: {
    // MavonEditor,
    ShowDown,
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
