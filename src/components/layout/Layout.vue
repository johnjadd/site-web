<template>
  <!--<div id="layout">
    <el-row>
      <NavBarTop></NavBarTop>
    </el-row>

    <el-row style="margin: 0px">
      <el-col :span="4">
        <nav-bar-side></nav-bar-side>
      </el-col>
      <el-col :span="20">
        <keep-alive>
          <router-view class="marginMainView"></router-view>
        </keep-alive>
      </el-col>
    </el-row>
  </div>-->
  <el-container>
    <el-header>
      <NavBarTop></NavBarTop>
    </el-header>

    <el-container style="margin-top: 5px">
      <el-aside width="200px">
        <nav-bar-side></nav-bar-side>
      </el-aside>

      <el-main style="margin-top: -15px">
        <div v-if="dataLoading">
          <Loading marginTop="10%"></Loading>
        </div>

        <keep-alive v-else>
          <router-view class="marginMainView"></router-view>
        </keep-alive>
      </el-main>
    </el-container>

  </el-container>
</template>


<script>
  import {mapGetters} from 'vuex'

  import NavBarTop from './NavBarTop';
  import NavBarSide from './NavBarSide';
  import Loading from './Loading'

  import apis from "../../mixins/apis"
  import utils from "../../mixins/utils"
  import ElContainer from "../../../node_modules/element-ui/packages/container/src/main.vue";
  import ElHeader from "../../../node_modules/element-ui/packages/header/src/main.vue";
  import ElMain from "../../../node_modules/element-ui/packages/main/src/main.vue";
  import ElAside from "../../../node_modules/element-ui/packages/aside/src/main.vue";

  export default {
    name: 'Layout',
    components: {
      ElAside,
      ElMain,
      ElHeader,
      ElContainer,
      NavBarTop,
      NavBarSide,
      Loading,
    },

    computed: {
      ...mapGetters({
      }),
    },

    mixins: [
      apis,
      utils,
    ],

    data() {
      return {
        dataLoading: false,
        intervalId: '',
      }
    },

    watch: {
      '$route'(to, from) {
        console.log(`Layout $route form ${from.name} to ${to.name}`);
        let fromIsCfg = (from.name.indexOf("cfg") > -1);
        let toIsCfg = (to.name.indexOf("cfg") > -1);
        if(toIsCfg !== fromIsCfg) {
          if(!toIsCfg) {
            this.postLoadDevToCacheFromApi(this.$store);
            this.startRefreshEvts();
          }else{
            this.stopRefreshEvts();
          }
        }
      },

      token() {
        console.log(`~~~~~~~~~~~~1 token state changed! token = ${this.token}`);
        this.refreshDataFromApi();
      },
    },

    created() {
      this.refreshDataFromApi();

    },

    methods: {
      refreshDataFromApi() {
        this.dataLoading = true;

        this.getSiteFromApi(this.$store).then(ret => {
          if (ret === "done") {
            console.log("Refresh Site FromServer done!");
            this.getDevsFromApi(this.$store).then(ret => {
              if (ret === "done") {
                console.log("refresh devs FromServer done!");
                this.dataLoading = false;

                if(this.$route.name.indexOf("cfg") === -1) {
                  this.startRefreshEvts();
                }

              } else {
                this.$message.error('Refresh devs from server failed!');
                this.dataLoading = false;
              }
            });
          } else {
            this.$message.error('Refresh site from server failed!');
            this.dataLoading = false;
          }
        });
      },

      startRefreshEvts() {
        this.stopRefreshEvts();
        this.refreshEvts();

        this.intervalId = setInterval(() => {
          this.refreshEvts();
        }, 5000);
      },

      stopRefreshEvts() {
        clearInterval(this.intervalId);
      },

      refreshEvts() {
        let {rootDev} = this.$store.getters;

        let devIds = this.getAllDevs(rootDev).map(dev => dev.id);
        devIds.splice(0,1); //去掉虚拟的根结点(id=-1, name=我的设备)

        this.getEvtsFromApi(devIds, this.$store).then(res => {
          //console.log(`~~~~~~~~~refreshEvts res = ${JSON.stringify(res)}`);
          if(res !== "failed") {
            let evts = res;
            this.$store.commit('setEvts', evts);

            //this.refreshDevEvtCount(rootDev, evts);
          }
        });
      },

    },
  }
</script>

<style>
  #app {
    width: 100%;
    position: absolute;
  }

  .marginMainView {
    margin: 0px;
  }


</style>
