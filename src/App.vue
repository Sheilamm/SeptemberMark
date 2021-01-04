<template>
  <div id="app">
    <img src="@/assets/images/title.png" alt="" @click="dialogVisible = true" />
    <el-row>
      <el-col :span="10">
        sssj
      </el-col>
      <el-col :span="10">
        sssj
      </el-col>
    </el-row>
    <el-dialog :visible.sync="dialogVisible">
      <ShowDown v-model="value" />
    </el-dialog>
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
      dialogVisible: false,
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
