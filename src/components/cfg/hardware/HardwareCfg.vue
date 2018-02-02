<template>
  <div style="margin: 0px">

    <div v-if="dataLoading">
      <Loading marginTop="10%"></Loading>
    </div>

    <div v-else-if="hwInfo === undefined">
      <small>获取数据失败！</small>
    </div>

    <div v-else>
      <el-row style="display: flex; margin-bottom: 5px; height: 30px;">
        <div style="margin-left: 0px; flex: 1; padding: 5px;">
          <span>嵌入式采集主机配置</span>
        </div>

        <div>
          <el-button size="small" type="" @click="refreshDataFromApi">刷新</el-button>
        </div>
      </el-row>

      <hw-main-info-card :hwMainInfo="hwInfo.mainInfo"
                         v-on:btnRebootClicked="rebootNw"
                         v-on:btnDnsModClicked="modDns(hwInfo.mainInfo.dns)">
      </hw-main-info-card>

      <nw-card v-for="(param, index) in hwInfo.nwsParam" :key="index" :nwParam="param"
                v-on:btnModifyClicked="modNw(param)" style="margin-top: 10px">
      </nw-card>
    </div>

    <el-dialog title="网络接口配置" :visible.sync="dialogFormNwVisible" style="padding: 0px">
      <nw-mod v-on:submit="dialogNwOk" v-on:cancel="dialogNwCancel"></nw-mod>
    </el-dialog>

    <el-dialog title="系统DNS配置" :visible.sync="dialogFormDnsVisible" style="padding: 0px">
      <dns-mod v-on:submit="dialogDnsOk" v-on:cancel="dialogDnsCancel"></dns-mod>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  import Loading from '../../layout/Loading'
  import NwMod from './NwMod.vue'
  import NwCard from './NwCard'
  import DnsMod from './DnsMod'
  import HwMainInfoCard from './HwMainInfoCard.vue'

  import apis from "../../../mixins/apis"

  export default {
    components: {
      //ElButton,
      Loading,
      NwCard,
      NwMod,
      DnsMod,
      HwMainInfoCard,
    },

    computed: {
      ...mapGetters({
        tempData: 'tempData',
      }),
    },

    watch: {
    },

    created() {
      this.refreshDataFromApi();
    },

    beforeDestroy() {
    },

    data() {
      return {
        dataLoading: false,
        dialogFormNwVisible: false,
        dialogFormDnsVisible: false,

        hwInfo: {
          mainInfo: {
            model: 'unknown',
            sn: 'unknown',
            produceTime: new Date(),
            maxDevCnt: 0,
            dns: [],
          },
          nwsParam: []
        }
      }
    },

    mixins: [
      //utils,
      apis,
    ],

    methods: {
      refreshDataFromApi() {
        this.dataLoading = true;

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
        });

      },

      rebootNw() {
        console.log(`rebootNw in HardwareCfg.vue`);
        this.postNwRebootToApi(this.$store);
      },

      modNw(param) {
        let data = JSON.parse(JSON.stringify(param));
        this.$store.commit('setTempData', data);

        this.dialogFormNwVisible = true;
      },

      dialogNwCancel() {
        this.dialogFormNwVisible = false;
      },

      dialogNwOk() {
        this.dialogNwCancel();
        let data = (this.tempData);

        let action = `Update network config to server`;
        console.log(`~~~~~~~ start ${action}, data = ${JSON.stringify(data)}`);
        this.postNwInfoToApi(data, this.$store).then(ret => {
          if (ret === "failed") {
            this.$message(
              {
                message: `${action} failed!`,
                type: 'warning'
              }
            );
          }
        });
      },

      modDns(param) {
        let data = JSON.parse(JSON.stringify(param));
        this.$store.commit('setTempData', data);

        this.dialogFormDnsVisible = true;
      },

      dialogDnsCancel() {
        this.dialogFormDnsVisible = false;
      },

      dialogDnsOk() {
        this.dialogDnsCancel();
        let data = (this.tempData);

        let action = `Update dns config to server`;
        console.log(`~~~~~~~ start ${action}, data = ${JSON.stringify(data)}`);
        this.postDnsInfoToApi(data, this.$store).then(ret => {
          if (ret === "failed") {
            this.$message(
              {
                message: `${action} failed!`,
                type: 'warning'
              }
            );
          }
        });
      },

    }
  }
</script>

<style scoped>

</style>
