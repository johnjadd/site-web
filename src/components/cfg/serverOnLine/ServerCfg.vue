<template>
  <div style="margin: 0px">

    <div v-if="dataLoading">
      <Loading marginTop="10%"></Loading>
    </div>

    <div v-else-if="serverInfo === undefined">
      <small>获取数据失败！</small>
    </div>

    <div v-else>
      <el-row style="display: flex; margin-bottom: 5px; height: 30px;">
        <div style="margin-left: 0px; flex: 1; padding: 5px;">
          <span>云服务器配置</span>
        </div>

        <div>
          <el-button size="small" type="" @click="refreshDataFromApi">刷新</el-button>
        </div>
      </el-row>

      <server-card :data="serverInfo"
                          @btnModClicked="modServer(serverInfo)"
                          @btnUploadDevClicked="uploadDevToServer">
      </server-card>

    </div>

    <el-dialog title="云服务器配置" :visible.sync="dialogFormServerModVisible" style="padding: 0px">
      <server-mod v-on:submit="dialogServerModOk" v-on:cancel="dialogServerModCancel"></server-mod>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  import Loading from '../../layout/Loading'
  import ServerMod from './ServerMod.vue'
  import ServerCard from './ServerCard'

  import apis from "../../../mixins/apis"

  export default {
    components: {
      Loading,
      ServerCard,
      ServerMod,
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
        dialogFormServerModVisible: false,

        serverInfo: {
          ip: '127.0.0.1',
          port: '9000',
        }
      }
    },

    mixins: [
      apis,
    ],

    methods: {
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
        });
        */

      },

      modServer(param) {
        let data = JSON.parse(JSON.stringify(param));
        this.$store.commit('setTempData', data);

        this.dialogFormServerModVisible = true;
      },

      uploadDevToServer() {
        let {rootDev} = this.$store.getters;
        let dev = rootDev.children[0];
        let {ip, port} = this.serverInfo;
        this.uploadDevToYunServerFromApi(dev, this.$store, ip, port).then(ret => {
          //console.log(`~~~~~~~~~~~ uploadDevToServer ret = ${JSON.stringify(ret)}`);
        });
      },

      dialogServerModCancel() {
        this.dialogFormServerModVisible = false;
      },

      dialogServerModOk() {
        this.dialogServerModCancel();
        /*let data = (this.tempData);

        let action = `Update network config to server`;
        console.log(`~~~~~~~ start ${action}, data = ${JSON.stringify(data)}`);
        this.postServerInfoToApi(data, this.$store).then(ret => {
          if (ret === "failed") {
            this.$message(
              {
                message: `${action} failed!`,
                type: 'warning'
              }
            );
          }
        });*/
      },

    }
  }
</script>

<style scoped>

</style>
