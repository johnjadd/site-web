<template>
  <div v-if="evts === undefined">
    <small>获取数据失败！</small>
  </div>

  <div v-else>
    <el-row style="display: flex; margin-bottom: 5px; height: 30px; width: 100%">
      <div style="margin-left: 0px; margin-right: 10px">
        <el-button @click="goCurrentEvt(devl.id)" style="padding: 5px;" type="info flex" plain>
          <i class="el-icon-arrow-left"></i>当前报警
        </el-button>

        <el-select v-model="selectedDevId" placeholder="请选择" size="mini"
                   @change="goEvtHis(selectedDevId)"
                   v-if="parent !== undefined">
          <el-option
            v-for="devx in parent.children"
            :key="devx.id"
            :label="devx.name"
            :value="devx.id">
          </el-option>
        </el-select>
      </div>

      <div style="margin-left: 0px; flex: 1;">
        <el-date-picker
          size="mini"
          v-model="dateRange"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          :start-placeholder="new Date() | moment('YYYY 年 MM 月 DD 日')"
          :end-placeholder="new Date() | moment('YYYY 年 MM 月 DD 日')"
          format="yyyy 年 MM 月 dd 日"
          :picker-options="pickerOptions"
          @change="commitSearch">
        </el-date-picker>
        <el-button @click="commitSearch" style="padding: 5px" type="info flex" plain>
          确定
        </el-button>
      </div>

      <el-button @click="goDev(parent.id)" style="padding: 5px" type="info flex" plain>
        <i class="el-icon-arrow-left"></i>返回设备
      </el-button>
    </el-row>

    <el-card style="width: 100%;" :body-style="{padding: '0px', fontWeight: 330}">

      <el-row style="background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
        <span>历史报警 共 {{tbData.length}} 条</span>
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
            prop="duration"
            label="持续"
            sortable width="80">
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ new Date(scope.row.time) | moment("from", new Date(scope.row.recoveredTime), true) }}</span>
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
            prop="time"
            label="恢复时间"
            sortable width="180">
            <template slot-scope="scope">
              <el-icon name="time"></el-icon>
              <span style="margin-left: 0px">{{new Date(scope.row.recoveredTime) | moment("YYYY-MM-DD HH:mm:ss")}}</span>
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
  //import DevLevelBar from "./../DevLevelBar"

  import utils from "../../mixins/utils"
  import apis from "../../mixins/apis"
  import routers from "../../mixins/routers"
  import idMaps from "../../mixins/idMaps"

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
      idMaps,
    ],

    computed: {
      ...mapGetters({
      })
    },

    data() {
      return {
        tbData: [],
        rowIndex: 1,
        evts: [],
        parent: undefined,
        devl: undefined,
        selectedDevId: '',

        showCurrentOrHistory: 'current',

        dateRange: '',
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三天',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600*1000*24*(3-1))
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一周',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (7-1));
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (30-1));
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (90-1));
                picker.$emit('pick', [start, end]);
              }
            },
            {
              text: '最近一年',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                start.setTime(start.getTime() - 3600 * 1000 * 24 * 365);
                picker.$emit('pick', [start, end]);
              }
            }
          ]
        },
      }
    },

    watch: {
      '$route'(to, from) {
        console.log(`EventHis.vue ~~~~~~~~~~~ route from ${from.path} to ${to.path}`);
        if(to.name === 'evt_his') {
          this.refreshCurrentEvt();
        }
      },
      devl() {
        if(this.devl === undefined) {
          this.selectedDevId = "";
        }else {
          this.selectedDevId = this.devl.id;
        }
      },
    },

    created() {
      this.refreshCurrentEvt();
    },

    methods: {
      refreshCurrentEvt() {
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

            data.index = index++;
            data.id = item.id;
            data.time = item.time;
            data.name = item.name;
            data.devId = item.devId;
            data.varId = item.varId;
            data.confirmed = item.confirmed;
            data.confirmedTime = item.confirmedTime;
            data.confirmedInfo = item.confirmedInfo;
            data.recoveredTime = item.recoveredTime;

            this.tbData.push(data);
          });
        }
      },

      commitSearch() {
        let date1 = moment().format("YYYY-MM-DD");
        let date2 = moment().format("YYYY-MM-DD");

        let strDateRange = this.dateRange.toString();
        if(strDateRange !== "") {
          let dates = strDateRange.split(',');
          date1 = moment(dates[0]).format("YYYY-MM-DD");
          date2 = moment(dates[1]).format("YYYY-MM-DD");
        }

        console.log(`date1 = ${date1}, date2 = ${date2}`);
        this.refreshDataFromApi(date1, date2);
      },

      refreshDataFromApi(date1, date2) {
        console.log(`~~~~~~~~~~~~~~ getEvtHistory starting...`);
        if(date1 === undefined || date2 === undefined) return;
        let devs = this.getAllDevs(this.devl);
        let devIds = [];
        devs.forEach(dev => devIds.push(dev.id));

        this.getEvtHisFromApi(devIds, this.$store, date1, date2).then(hisEvts => {
          this.fillTableData(hisEvts);
        });
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
