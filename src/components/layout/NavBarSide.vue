<template>
  <div class="margin1">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      @select="menuClicked">

      <el-menu-item index="dev">
        <i class="el-icon-menu"></i>
        <span>设备变量</span>
      </el-menu-item>

      <el-menu-item index="msg">
        <i class="el-icon-bell"></i>
        <span>系统消息</span>
        <el-badge class="item" :value="evts.length"/>
      </el-menu-item>

      <el-submenu index="cfg">
        <template slot="title">
          <i class="el-icon-setting"></i>
          <span>配置</span>
        </template>
        <el-menu-item index="cfg_dev">设备定义</el-menu-item>
        <el-menu-item v-if="!$store.getters.isYunServerWeb" index="cfg_hardware">采集主机</el-menu-item>
        <el-menu-item v-if="!$store.getters.isYunServerWeb" index="cfg_server">云服务器</el-menu-item>
      </el-submenu>

    </el-menu>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import apis from "../../mixins/apis"
  import utils from "../../mixins/utils"

  export default {
    computed: {
      ...mapGetters({
        evts: 'evts',
      })
    },

    components: {},

    mixins: [
      apis,
      utils,
    ],

    watch: {
      '$route'(to, from) {
        console.log(`NavBarSide $route form ${from.path} to ${to.path}`);
        this.updateRouter(this.currentKey, to.path);
      },
    },

    created() {

      this.updateRouter("var", "/layout/dev/:devId/var");
      this.updateRouter("var_info", "/layout/dev/:devId/var/:varId");
      this.updateRouter("var_his", "/layout/dev/:devId/var/:varId/his");
      this.updateRouter("evt_his", "/layout/evt/his/:devId");
      this.updateRouter("cfg_var", "/layout/cfg/dev/:devId/var");

      this.updateRouter("dev", "/layout/dev/-1");
      this.updateRouter("msg", "/layout/msg");
      this.updateRouter("cfg_dev", "/layout/cfg/dev/-1");
      this.updateRouter("cfg_hardware", "/layout/cfg/hardware");
      this.updateRouter("cfg_server", "/layout/cfg/server");
      console.log(`NavBarSide created! current router is ${this.$router.currentRoute.name}`);
      let key = this.$router.currentRoute.name;
      if(key==='var'){
        key ='dev';
      }
      this.activeIndex = key;
    },

    data() {
      return {
        activeIndex: '',
        routers: [{key: '', path: ''}],
        currentKey: 'dev',
      }
    },

    methods: {
      handleOpen(key, keyPath) {
        //console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        //console.log(key, keyPath);
      },
      menuClicked(key, keyPath) {
        console.log(`NavBarSide.vue menuClicked! key = ${key}, keyPath = ${keyPath}`);
        this.currentKey = key;
        let index = this.getLastRouter(key);

        console.log(`NavBarSide.vue menuClicked! index = ${index}`);

        if(index > -1) {
          this.$router.push(this.routers[index].path);
        }
      },

      getLastRouter(key) {
        return this.routers.findIndex(router => router.key === key);
      },

      updateRouter(key, path) {
        let router = {key, path};
        let index = this.getLastRouter(key);
        //console.log(`updateRouter index = ${index}`);
        if(index > -1) {
          this.routers.splice(index, 1, router);
        }else{
          this.routers.push(router);
        }
      }

    },

  }
</script>

<style scoped>
  .marginTopMenu {
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px
  }

  .margin1 {
    margin-top: 0px;
    margin-left: 0px;
    margin-right: 0px;
    margin-bottom: 0px;
    border-radius: 0px;
  }

  .smallTopBar {
    padding-top: 5px;
    margin-bottom: 15px;
    border-color: black;
    border-width: 2px;
  }

  .item {
    margin-top: -20px;
    margin-right: 60px;
  }
</style>
