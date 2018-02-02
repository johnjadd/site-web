<template>
  <div v-if="devl === undefined">
    <small>获取数据失败！</small>
  </div>

  <div v-else>
    <el-row style="display: flex; margin-bottom: 5px; height: 30px; width: 100%">
      <div style="margin-left: 0px; margin-right: 10px; flex: 1">
        <el-button @click="goEvtHis(devl.id)" style="padding: 5px" type="info flex" plain>
          历史报警<i class="el-icon-arrow-right"></i>
        </el-button>

        <el-select v-model="selectedDevId" placeholder="请选择" size="mini"
                   @change="goCurrentEvt(selectedDevId)"
                   v-if="parent !== undefined">
          <el-option
            v-for="devx in parent.children"
            :key="devx.id"
            :label="devx.name"
            :value="devx.id">
          </el-option>
        </el-select>
      </div>

      <el-button @click="goDev(parent.id)" style="padding: 5px" type="info flex" plain>
        <i class="el-icon-arrow-left"></i>返回设备
      </el-button>
    </el-row>

    <el-card style="width: 100%;" :body-style="{padding: '0px', fontWeight: 330}">

      <el-row style="background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
        <span>正在报警 共 {{tbData.length}} 条</span>
      </el-row>

      <el-row>
        <el-table :data="tbData"
                  stripe
                  style="width: 100%; margin-top: 5px;">
          <el-table-column
            type="index"
            :index="rowIndex">
          </el-table-column>

          <el-table-column
            prop="id"
            label="编号"
            width="120">
          </el-table-column>

          <el-table-column
            prop="name"
            label="描述"
            width="300"
            sortable>
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.name }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="devId"
            label="来源"
            sortable width="380">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{getFullDevName(scope.row.devId)}} {{getVarName(scope.row.devId, scope.row.varId)}} : {{scope.row.value}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="time"
            label="发生时间"
            sortable width="220">
            <template slot-scope="scope">
              <el-icon name="time"></el-icon>
              <span style="margin-left: 0px">{{new Date(scope.row.time) | moment("YYYY-MM-DD HH:mm:ss ddd")}}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="confirm"
            label="被确认"
            sortable>
            <template slot-scope="scope">
              <span style="margin-left: 0px" v-if="scope.row.confirmed ">
                <span>
                  {{ new Date(scope.row.confirmedTime) | moment("YYYY-MM-DD HH:mm:ss ddd") }}
                  {{ scope.row.confirmedInfo }}
                </span>
              </span>
            </template>
          </el-table-column>

        </el-table>
      </el-row>
    </el-card>
  </div>

</template>

<script>
  import {mapGetters} from 'vuex'

  //import Loading from '../Layout/Loading'
  //import DevLevelBar from "./DevLevelBar"

  import utils from "../../mixins/utils"
  import apis from "../../mixins/apis"
  import idMaps from "../../mixins/idMaps"
  import routers from "../../mixins/routers"

  let moment = require('moment');

  export default {
    components: {
      //Loading,
      //DevLevelBar,
    },

    mixins: [
      utils,
      apis,
      routers,
    ],

    computed: {
      ...mapGetters({
        evts: 'evts',
      })
    },

    data() {
      return {
        tbData: [],

        devl: undefined,
        parent: undefined,
        selectedDevId: '',

        rowIndex: 0,
      }
    },

    watch: {
      '$route'(to, from) {
        //console.log(`VarHis.vue ~~~~~~~~~~~ route from ${from.path} to ${to.path}`);
        if(to.name === 'evt') {
          this.refreshCurrentData();
        }
      },

      devl() {
        if(this.devl === undefined) {
          this.selectedDevId = "";
        }else {
          this.selectedDevId = this.devl.id;
        }
      },

      evts() {
        this.refreshCurrentData();
      }
    },

    created() {
      this.refreshCurrentData();
    },

    methods: {
      refreshCurrentData() {
        let {devId} = this.$route.params;
        console.log(`EventHis.vue refreshCurrentEvt devId = ${devId}`);
        this.devl = this.getDev(devId);

        if(this.devl === undefined) return;

        this.parent = this.getParent(devId);

        this.commitSearch();
      },

      fillTableData(hisEvts) {
        this.tbData.splice(0);

        let index = 0;

        if (hisEvts !== undefined) {
          hisEvts.forEach(item => {
            let data = JSON.parse(JSON.stringify(item));

            data.id = item.id;
            data.index = index++;
            data.time = item.time;
            data.name = item.name;
            data.devId = item.devId;
            data.varId = item.varId;
            data.confirmed = item.confirmed;
            data.confirmedTime = item.confirmedTime;
            data.confirmedInfo = item.confirmedInfo;

            this.tbData.push(data);
          });
        }
      },

      commitSearch() {
        this.refreshData();
      },

      refreshData() {
        let {evtsOfMe, evtsOfChildren} = this.getEvts(this.evts, this.devl);
        this.fillTableData(evtsOfMe.concat(evtsOfChildren));
      },

    }
  }
</script>

<style scoped>

</style>
