<template>
  <div v-if="devl === undefined">
    <small>获取数据失败！</small>
  </div>

  <div v-else>

    <el-card v-if="devl" style="width: 100%;" :body-style="{padding: '0px', fontWeight: 330}">

      <el-row style="background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
        <span>{{devl.name}}</span>
      </el-row>

      <el-row>
        <el-table :data="tbData"
                  stripe
                  style="width: 100%; margin-top: 5px;">
          <el-table-column
            prop="id"
            label="ID"
            sortable width="60">
          </el-table-column>

          <el-table-column
            prop="type"
            label="类型"
            sortable width="100">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.type === 0? '模拟量': '开关量' }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="value"
            label="当前值"
            sortable width="120">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.value }} <small>{{ scope.row.unit }}</small></span>
              　<!--<el-button v-if="true" size="mini" type="info" style="padding: 2px" plain @click="goVarInfo(scope.row.devId, scope.row.id)">历史</el-button>-->
            </template>
          </el-table-column>

          <el-table-column
            prop="name"
            label="名称"
            sortable>
          </el-table-column>

          <el-table-column
            prop="time"
            label="更新时间"
            sortable width="180">
            <template slot-scope="scope">
              <el-icon name="time"></el-icon>
              <span style="margin-left: 0px">{{ new Date(scope.row.time) | moment("YYYY-MM-DD HH:mm:ss") }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <div>
                <el-button type="text" style="padding: 0px" @click="goVarHis(scope.row.devId, scope.row.id)">历史数据</el-button>
              </div>
            </template>
          </el-table-column>

        </el-table>
      </el-row>
    </el-card>

    <!--<div style="margin-top: 15px" >
      <bed-room></bed-room>
    </div>-->
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'

  import DevLevelBar from "./DevLevelBar"
  //import BedRoom from "./charts/BedRoom.vue"

  import utils from "../../mixins/utils"
  import apis from "../../mixins/apis"
  import idMaps from "../../mixins/idMaps"
  import routers from "../../mixins/routers"

  export default {
    components: {
      //Loading,
      //DevLevelBar,
      //BedRoom,
    },

    mixins: [
      utils,
      idMaps,
      routers,
      apis,
    ],

    computed: {
      ...mapGetters({
      })
    },

    props: {
      devId: '',
      active: false,
    },

    data() {
      return {
        tbData: [],

        devl: undefined,
        intervalId: '',
        parents: [],
        selectedDevId: '',
      }
    },

    watch: {
      /*'$route'(to, from) {
        console.log(`Vars.vue ~~~~~~~~~~~ route from ${from.path} to ${to.path}`);
        if(to.name === 'var') {
          this.refreshCurrentDev();
        }else {
          this.stopRefreshVarValues();
        }
      },*/
      devId() {
        console.log(`VarCur.vue devId changed! devId = ${this.devId}`);
        this.refreshCurrentDev();
      },
      active() {
        if(!this.active) {
          this.stopRefreshVarValues();
        }
      }
    },

    created() {
      this.refreshCurrentDev();
    },

    methods: {
      /*backToDev() {
        let {parents} = this;
        if (parents.length > 1) {
          parents.pop();
        }
        this.goDev(parents[parents.length - 1].id);
      },*/

      /*goDev(devId) {
        this.$router.push({name: 'dev', params: {devId}});
      },*/

      refreshCurrentDev() {
        let {dev, parents} = this.getDevAndPath(this.devId);
        this.devl = dev;
        this.parents = parents;
        //console.log(`~~~~~~~~ this.parents = ${JSON.stringify(this.parents)}`);
        if (this.devl !== undefined) {
          this.fillTableData(this.devl);
        }

        this.startRefreshVarValues();
      },

      startRefreshVarValues() {
        //console.log(`~~~~~~~~~~~~~~~~~~~ startRefreshVarValues`);
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
        console.log(`~~~~~~~~~~~~~~ getVarValues starting...`);
        this.getVarValuesByDevFromApiTest(this.devl, this.$store).then(res => {
          let varsData = res;
          varsData.forEach(data => {
            this.updateVarValue(data);
          });

          this.fillTableData(this.devl);
        });
      },

      fillTableData(dev) {
        this.tbData.splice(0);
        let index = 0;
        let datas = dev.vars;
        this.boolVarCnt = 0;

        if (datas !== undefined) {
          datas.forEach(item => {
            let data = JSON.parse(JSON.stringify(item));

            data.index = index++;
            data.devId = dev.id;
            data.devName = dev.name;
            data.value = item.value;
            //data.chief = (item.chief)? item.chief: 0;
            //data.chief = 1;

            if (data.type === "1") {
              this.boolVarCnt++;
            }
            this.tbData.push(data);
          });
        }
      },
    }
  }
</script>

<style scoped>
</style>
