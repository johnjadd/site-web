<template>
  <div>
    <el-row style="display: flex; margin-bottom: 5px; height: 30px; width: 100%">
      <div style="flex: 1;">
        <span style="float: left; margin-right: 5px;" v-for="varx in devl.vars" key="varx.id"
              @click="goVarInfo(varx.devId, varx.id)">
          <el-tag size="small" type="info" closable>{{varx.name}}</el-tag>
        </span>
      </div>

      <el-button @click="goVar(devl.id)" style="padding: 5px" type="info" plain>
        <i class="el-icon-arrow-left"></i>返回变量列表
      </el-button>

    </el-row>

    <el-card v-if="true" style="" :body-style="{padding: '0px'}">
      <el-row style="background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
        <span>变量信息</span>
      </el-row>

      <div style="margin-top: 10px">
        <el-row :style="rowStyle">
          <el-col :span="8">名称: </el-col>
          <el-col :span="8">{{varl.name}} [{{varl.type === 0 ? '模拟量' : '开关量'}}]</el-col>
        </el-row>

        <el-row :style="rowStyle">
          <el-col :span="8">所属设备: </el-col>
          <el-col :span="8">{{parents.join('/')}}</el-col>
        </el-row>

        <el-row :style="rowStyle">
          <el-col :span="8">当前值: </el-col>
          <el-col :span="16">
            {{varl.value}} {{varl.unit}} [{{ new Date(varl.time) | moment("YYYY-MM-DD HH:mm:ss")}}]
            <el-button type="text" style="padding: 0px" @click="goVarHis(varl.devId, varl.id)">
              历史数据
            </el-button>
          </el-col>
        </el-row>

        <el-row :style="rowStyle">
          <el-col :span="8">刷新频率: </el-col>
          <el-col :span="8">最近1分钟刷新 5 次
          </el-col>
        </el-row>

        <el-row :style="rowStyle">
          <el-col :span="8">上次报警: </el-col>
          <el-col :span="8">温度超高报警 [{{ new Date(varl.time) | moment("YYYY-MM-DD HH:mm:ss")}}]
            <el-button type="text" style="padding: 0px" @click="goVarHis(varl)">
              历史报警
            </el-button>
          </el-col>
        </el-row>

        <el-row :style="rowStyle"
                v-if="varl.type === 0">
          <el-col :span="8">24小时内 最大值／最小值: </el-col>
          <el-col :span="8">34/23 </el-col>
        </el-row>

        <el-row :style="rowStyle"
                v-else>
          <el-col :span="8">24小时内 值反转: </el-col>
          <el-col :span="8">1 次 </el-col>
        </el-row>


      </div>

    </el-card>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  import utils from "../../mixins/utils"
  import apis from "../../mixins/apis"
  import routers from "../../mixins/routers"

  import DevLevelBar from "./DevLevelBar"

  export default {
    components: {
      DevLevelBar
    },

    computed: {
      ...mapGetters({}),
    },

    props: {},

    watch: {
      '$route'(to, from) {
        console.log(`VarInfoCard.vue ~~~~~~~~~~~ route from ${from.path} to ${to.path}`);
        if (to.name === 'var_info') {
          this.refreshCurrentVar();
        }
      },
    },

    created() {
      this.refreshCurrentVar();
    },

    beforeDestroy() {
    },

    data() {
      return {
        varl: undefined,
        devl: undefined,
        parents: [],

        rowStyle: "margin-left: 25px; font-weight: 200; margin-bottom: 10px; border-bottom: 1px solid #ecf0f1;"
      }
    },

    mixins: [
      utils,
      routers,
    ],

    methods: {
      refreshCurrentVar() {
        let {devId, varId} = this.$route.params;
        console.log(`VarInfoCard.vue refreshCurrentVar devId = ${devId}, varId = ${varId} `);
        let {dev, parents} = this.getDevAndPath(devId);
        this.devl = dev;
        this.parents = parents.map(parent => parent.name);
        if (this.devl !== undefined) {
          this.varl = this.getVar(varId, this.devl);
          console.log(`VarInfoCard.vue refreshCurrentVar this.varl = ${JSON.stringify(this.varl)} `);
        }

        this.refreshDataFromApi();
      },

      refreshDataFromApi() {
        /*this.dataLoading = true;

        let action = `Refresh network config from server`;
        console.log(`${action}`);

        this.getHwMainInfoFromApi(this.$store).then(ret => {
          if (ret !== "failed") {
            this.hwInfo.mainInfo = ret;

            this.getNwInfoFromApi(this.$store).then(ret => {
              if (ret !== "failed") {
                this.hwInfo.nwsParam = ret;
                this.dataLoading = false;
              } else {
                this.$message.error(`${action} failed!`);
                this.dataLoading = false;
              }
            });
          } else {
            this.$message.error(`${action} failed!`);
            this.dataLoading = false;
          }
        });*/

      },
    }
  }
</script>

<style scoped>

</style>
