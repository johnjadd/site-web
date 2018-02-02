<template>
  <div style="margin: 0px">
    <div v-if="devx === undefined">
      <small>获取数据失败！</small>
    </div>

    <div v-else>
      <el-row style="display: flex; margin-bottom: 5px; height: 30px;">
        <div style="margin-left: 0px; flex: 1; padding: 5px;">
          <DevLevelBar></DevLevelBar>
        </div>

        <div style="width: 100px;">
          <el-slider v-model="cntPerRow" :min="1" :max="6" :format-tooltip="slideToolTip"   ></el-slider>
        </div>

        <el-button v-if="!isRootDev(devx)" @click="parents.pop(); goDev(parents[parents.length-1].id);" style="padding: 5px; margin-left: 20px" type="info flex" plain>
          <i class="el-icon-arrow-left"></i>返回父设备
        </el-button>
      </el-row>

      <el-row v-for="(o, index) in rowCnt" :key="index" type="flex" style="padding: 0px" :gutter="10">
        <el-col :span="12" v-for="(dev, index) in tbData.slice((index)*cntPerRow, (index+1)*cntPerRow)" :key="index" style="flex: 1; margin-bottom: 10px;">
          <dev-card :devl="dev"
                    v-on:goChildren="goDev"
                    v-on:goVar="goVar">
          </dev-card>

        </el-col>

      </el-row>

    </div>

    <!--<div>
      <devs-tree></devs-tree>
    </div>-->

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  import Vars from './Vars'
  import Loading from '../layout/Loading'
  import DevCard from './DevCard'
  import DevLevelBar from './DevLevelBar'
  //import DevsTree from './charts/DevsTree'

  import utils from "../../mixins/utils"
  import apis from "../../mixins/apis"
  import routers from "../../mixins/routers"

  import ElCard from "../../../node_modules/element-ui/packages/card/src/main.vue";

  export default {
    components: {
      ElCard,
      //ElButton,
      Loading,
      DevCard,
      DevLevelBar,
      //DevsTree,
    },

    computed: {
      ...mapGetters({
        cntPerRowInDevs: 'cntPerRowInDevs',
      }),

      rowCnt() {
        return  Math.ceil(this.devx.children.length/this.cntPerRow);
      },

    },

    watch: {
      '$route'(to, from) {
        console.log(`Devs.vue ~~~~~~~~~~~ route from ${from.path} to ${to.path}`);
        if(to.name==='dev') {
          this.refreshCurrentDev();
        }else {
          this.stopRefreshVarValues();
          this.$store.commit('setCntPerRowInDevs', this.cntPerRow);
        }
      },

      cntPerRowInDevs() {
        this.cntPerRow = this.cntPerRowInDevs;
      }
    },

    created() {
      this.refreshCurrentDev();
      this.cntPerRow = this.cntPerRowInDevs;
    },

    data() {
      return {
        tbData: [],
        devx: undefined,
        parents: [],
        cntPerRow: 4,
        chiefVars: [],
      }
    },

    mixins: [
      utils,
      apis,
      routers,
    ],

    methods: {
      slideToolTip() {
        return ('每行显示' + this.cntPerRow + '个')  ;
      },

      handleNodeClick(data) {
        console.log(data);
      },

      refreshCurrentDev() {
        let {devId} = this.$route.params;

        let devAndPath = this.getDevAndPath(devId);
        if (devAndPath === undefined) return;

        let {dev, parents} = devAndPath;
        this.devx = dev;
        this.parents = parents;

        if (!this.devx) return;

        this.fillTableData(this.devx.children);

        this.startRefreshVarValues();
      },

      fillTableData(data) {
        this.tbData.splice(0);
        let index = 0;
        let devs = [];

        if (data) {
          data.forEach(item => {
            let dev = JSON.parse(JSON.stringify(item));

            dev.index = index++;
            dev.status = "normal";
            dev.fatherName = item.fatherName;
            dev.childrenLength = item.children.length;
            dev.varsLength = item.vars.length;
            dev.fatherId = item.fatherId;
            dev.chiefVars = this.getChiefVars(item);
            devs.push(dev);
          });

          this.tbData = this.sortDevsByEvt(devs, this.$store.getters.evts);
          console.log("fillTableData finished!");
        }
      },

      startRefreshVarValues() {
        this.stopRefreshVarValues();
        this.refreshVarValues();

        this.intervalId = setInterval(() => {
          this.refreshVarValues();
        }, 5000);
      },

      stopRefreshVarValues() {
        clearInterval(this.intervalId);
      },

      refreshVarValues() {
        /*let vars = [];
        this.tbData.forEach(idev => {
          let {chiefVars} = idev;
          if(chiefVars !== undefined) {
            vars = vars.concat(chiefVars);
          }
        });

        if(vars.length < 1) return;*/

        let needRefresh = false;
        let devs = this.tbData.map(idev => {
          let {id, chiefVars} = idev;
          let dev = {id: id, vars: []};
          chiefVars.forEach(ivar => {
            let tempVar = {id: ivar.id};
            dev.vars.push(tempVar);
            needRefresh = true;
          });
          return dev;
        });
        if(devs.length === 0) return;

        //console.log(`~~~~~~~~~~~~~~~~~refreshVarValues chiefVars = ${JSON.stringify(vars)}`);
        if(!needRefresh) return;

        this.getVarValuesFromApiTest(devs, this.$store).then(res => {
          let varsData = res;
          varsData.forEach(data => {
            this.updateVarValue(data);
          });

          this.fillTableData(this.devx.children);
        });
      },

      getDevFromTbData(index) {
        if (this.devx === undefined) return undefined;
        if (this.devx.children === undefined) return undefined;
        return this.devx.children[index];
      },

    }
  }
</script>

<style scoped>
  .smallTopBar {
    background-color: White;
    padding: 5px;
    margin-bottom: 5px;
    border-color: black;
    border-width: 2px;
  }
</style>
