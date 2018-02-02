<template>
  <el-card v-if="true" style="" :body-style="{padding: '0px'}">
    <el-row style="background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
      <span>主机信息</span>
    </el-row>

    <div style="margin-top: 10px">
      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">型号: </el-col>
        <el-col :span="8">{{hwMainInfo.model}}</el-col>
      </el-row>

      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">序列号: </el-col>
        <el-col :span="8">{{hwMainInfo.sn}}</el-col>
      </el-row>

      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">生产日期: </el-col>
        <el-col :span="8" >{{hwMainInfo.produceTime | moment("YYYY-MM-DD")}}</el-col>
      </el-row>

      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">设备容量: </el-col>
        <el-col :span="8">{{hwMainInfo.maxDevCnt}}</el-col>
      </el-row>

      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">网络DNS: </el-col>

        <el-col :span="8">
          <span style="margin-right: 10px" v-for="(dns,index) in hwMainInfo.dns" :key="index">{{dns.value}}</span>
          <el-button size="mini" type="text" style="padding: 0px" @click="btnDnsModClicked">修改</el-button>
        </el-col>
      </el-row>

      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">重启设备: </el-col>
        <el-col :span="8" >
          <el-button size="mini" type="text" style="padding: 0px" @click="btnRebootClicked">重新启动</el-button>
        </el-col>
      </el-row>

    </div>

  </el-card>

  <div v-else>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  import utils from "../../../mixins/utils"
  import apis from "../../../mixins/apis"

  export default {
    components: {
    },

    computed: {
      ...mapGetters({
      }),
    },

    props: {
      hwMainInfo: undefined,
    },

    watch: {
    },

    created() {
    },

    beforeDestroy() {
    },

    data() {
      return {
      }
    },

    mixins: [
    ],

    methods: {
      btnRebootClicked() {
        console.log(`btnRebootClicked in HwMainInfoCard.vue`);
        this.$emit('btnRebootClicked');
      },

      btnDnsModClicked() {
        console.log('btnDnsModClicked in HwMainInfoCard.vue');
        this.$emit('btnDnsModClicked');
      },

    }
  }
</script>

<style scoped>

</style>
