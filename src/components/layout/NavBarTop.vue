<template>
  <!--<el-card :body-style="{ padding: '0px' }">-->
  <div>
    <el-menu background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
             :default-active="activeIndex" class="el-menu-demo" mode="horizontal"
             @select="menuClicked">
      <div class="grid-content bg-purple">
        <el-menu-item index="logo">机房环境监控系统</el-menu-item>
      </div>

      <div class="grid-content bg-purple" style="float: right;">
        <el-menu-item index="signIn" v-if="user===undefined">登录</el-menu-item>

        <el-submenu index="user" v-if="user!=undefined">
          <template slot="title">{{user === undefined ? '用户' : user.username}}</template>
          <el-menu-item index="logOut">注销</el-menu-item>
          <el-menu-item index="profile">详细</el-menu-item>
        </el-submenu>
      </div>
    </el-menu>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'
  import apis from "../../mixins/apis"
  import ElCard from "../../../node_modules/element-ui/packages/card/src/main.vue";
  //import utils from "../mixins/utils"

  export default {
    computed: {
      ...mapGetters({
        //wndModex: "wndMode",
        //token: 'token',
        user: 'user',
      })
    },

    components: {
      ElCard
    },

    mixins: [
      apis,
      //utils,
    ],

    data() {
      return {
        activeIndex: '1',
      }
    },

    methods: {
      menuClicked(key, keyPath) {
        if (key === "logOut") {
          this.$router.push(`/signIn`);
          this.signOut();
        } else if (key === "logIn") {
          this.$router.push(`/signIn`);
        } else if (key === "profile") {

        }
      },

      signOut() {
        if (this.user !== undefined) {
          this.$store.commit('setUser', undefined);
          window.localStorage.removeItem('token');
        }
      },

    },

  }
</script>

<style scoped>
  .marginTopMenu {
    margin-left: 0px;
    margin-right: 0px;
    margin-top: 0px;
    margin-bottom: 0px;
    border-radius: 0px;
  }
</style>
