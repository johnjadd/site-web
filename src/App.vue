<template>
  <div id="app">
    <!--<el-row>
      <NavBarTop></NavBarTop>
    </el-row>

    <el-row> -->
      <router-view class="marginMainView"></router-view>

  </div>
</template>


<script>
  import NavBarTop from './components/layout/NavBarTop';
  import NavBarSide from './components/layout/NavBarSide';

  export default {
    name: 'app',
    components: {
      NavBarTop,
      NavBarSide,
    },

    data() {
      return {

      }
    },

    methods: {},
  }
</script>

<style>
  #app {
    width: 100%;
    position: absolute;
  }

  .marginMainView {
    margin: 15px;
  }


</style>
