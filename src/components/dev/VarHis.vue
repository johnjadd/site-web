<template>
  <div v-if="varl === undefined">
    <small>获取数据失败！</small>
  </div>

  <div v-else>

    <el-row style="display: flex; margin-bottom: 5px; height: 30px; width: 100%">
      <div style="margin-left: 0px; margin-right: 10px">
        <el-radio-group v-model="showDataOrGraph" size="mini">
          <el-radio-button label="data">数据</el-radio-button>
          <el-radio-button label="graph">图表</el-radio-button>
        </el-radio-group>
      </div>

      <div style="margin-left: 0px; margin-right: 10px">
        <el-select v-model="selectedVarId" placeholder="请选择" size="mini"
          @change="goVarHis(devl.id, selectedVarId)">
          <el-option
            v-for="varx in devl.vars"
            :key="varx.id"
            :label="varx.name"
            :value="varx.id">
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

      <el-button @click="goVar(varl.devId)" style="padding: 5px" type="info flex" plain>
        <i class="el-icon-arrow-left"></i>返回变量
      </el-button>
    </el-row>

    <el-card v-if="varl" style="width: 100%;" :body-style="{padding: '0px', fontWeight: 330}">

      <el-row style="display: flex; background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
        <span style="flex: 1">{{varl.name}} 共{{tbData.length}}条</span>

      </el-row>

      <el-row v-if="showDataOrGraph==='data'">
        <el-table :data="tbData"
                  stripe
                  style="width: 100%; margin-top: 5px;">
          <el-table-column
            type="index"
            :index="rowIndex">
          </el-table-column>

          <el-table-column
            prop="time"
            label="时间"
            sortable width="180">
            <template slot-scope="scope">
              <el-icon name="time"></el-icon>
              <span style="margin-left: 0px">{{ new Date(scope.row.time) | moment("YYYY-MM-DD HH:mm:ss") }}</span>
            </template>
          </el-table-column>

          <el-table-column
            prop="value"
            label="值"
            sortable>
            <template slot-scope="scope">
              <span style="margin-left: 0px">{{ scope.row.value }} <small>{{ scope.row.unit }}</small></span>
            </template>
          </el-table-column>

        </el-table>
      </el-row>

      <el-row v-if="showDataOrGraph==='graph'">
        <var-his-line :graphData="dataForGraph"></var-his-line>
      </el-row>
    </el-card>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'

  //import Loading from '../Layout/Loading'
  import DevLevelBar from "./DevLevelBar"
  import VarHisLine from "./charts/VarHisLine.vue"

  import utils from "../../mixins/utils"
  import apis from "../../mixins/apis"
  import idMaps from "../../mixins/idMaps"
  import routers from "../../mixins/routers"

  let moment = require('moment');

  export default {
    components: {
      //Loading,
      DevLevelBar,
      VarHisLine,
    },

    mixins: [
      utils,
      apis,
      idMaps,
      routers,
    ],

    computed: {
      ...mapGetters({
      }),

      dataForGraph() {
        let values = [];
        this.tbData.forEach(item => {
          let data = [];
          data.push(moment(item.time).format("YYYY/MM/DD HH:mm:ss"));
          data.push(item.value);
          values.push(data);
        });

        let datas = [];
        datas.push({values, name: this.devl.name + " " + this.varl.name});

        let graphData =  {dateRange: this.parseDateRange(),
                          datas: datas,
                          unit: (this.varl.unit !== undefined)?this.varl.unit : ''};
        console.log(`dataForGraph = ${JSON.stringify(graphData)}`);
        return graphData;
      }
    },

    data() {
      return {
        tbData: [],
        rowIndex: 1,
        showDataOrGraph: 'graph',
        intervalId: '',

        devl: undefined,
        varl: undefined,
        selectedVarId: '',
        //parents: [],

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
                start.setTime(start.getTime() - 3600 * 1000 * 24 * (3-1));
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
            }
          ]
        },
      }
    },

    watch: {
      '$route'(to, from) {
        //console.log(`VarHis.vue ~~~~~~~~~~~ route from ${from.path} to ${to.path}`);
        if(to.name === 'var_his') {
          this.refreshCurrentVar();
        }
      },
      varl() {
        if(this.varl === undefined) {
          this.selectedVarId = "";
        }else {
          this.selectedVarId = this.varl.id;
        }
      },
    },

    created() {
      this.refreshCurrentVar();
    },

    methods: {
      refreshCurrentVar() {
        let {devId, varId} = this.$route.params;
        this.devl = this.getDev(devId);
        if (this.devl !== undefined) {
          this.varl = this.getVar(varId, this.devl);
        }
        this.commitSearch();
      },

      refreshDataFromApi(date1, date2) {
        console.log(`~~~~~~~~~~~~~~ getVarHistory starting...`);
        if(date1 === undefined || date2 === undefined) return;

        this.getVarHisFromApi(this.varl, this.$store, date1, date2).then(timeValues => {
          this.fillTableData(timeValues);
        });
      },

      fillTableData(timeValues) {
        this.tbData.splice(0);

        let index = 0;

        if (timeValues !== undefined) {
          timeValues.forEach(item => {
            let data = JSON.parse(JSON.stringify(item));

            data.index = index++;
            data.time = item.t;
            data.value = item.v;

            this.tbData.push(data);
          });
        }
      },

      commitSearch() {
        let {date1, date2} = this.parseDateRange();
        console.log(`date1 = ${date1}, date2 = ${date2}`);
        this.refreshDataFromApi(date1, date2);
      },

      parseDateRange() {
        let date1 = moment().format("YYYY-MM-DD");
        let date2 = moment().format("YYYY-MM-DD");

        let {dateRange} = this;
        if(dateRange !== undefined && dateRange !== null) {
          let strDateRange = dateRange.toString();
          if (strDateRange !== "") {
            let dates = strDateRange.split(',');
            date1 = moment(dates[0]).format("YYYY-MM-DD");
            date2 = moment(dates[1]).format("YYYY-MM-DD");
          }
        }

        return {date1, date2};
      }

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
