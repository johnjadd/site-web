<template>
  <el-card v-if="nwParam" style="" :body-style="{padding: '0px'}">
    <el-row style="background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
      <span>网络配置 {{nwParam.name}}</span>
      <el-button size="mini" style="float: right; " palin @click="btnModClicked">
        <i class="el-icon-edit" style="color: #00643b"></i>
        修改
      </el-button>
    </el-row>

    <div style="margin-top: 10px">
      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">地址分配: </el-col>
        <el-col :span="8" >{{nwParam.dhcp? "DHCP自动分配": "静态手工分配"}}</el-col>
      </el-row>
      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">IP 地址: </el-col>
        <el-col :span="8" >{{nwParam.ip}}</el-col>
      </el-row>
      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">子网掩码: </el-col>
        <el-col :span="8" >{{nwParam.mask}}</el-col>
      </el-row>
      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">网关: </el-col>
        <el-col :span="8" >{{nwParam.gateway}}</el-col>
      </el-row>
      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">状态: </el-col>
        <el-col :span="8" >{{nwParam.up? '启用': '禁用'}}, {{nwParam.running? '已连接': '未连接'}}
          <span style="border: 1px, solid, 'red'; width: 20px; background-color: #1fcab3"></span>
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
      nwParam: undefined,
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
      btnModClicked() {
        console.log('~~~~~~~~~~~~~~~~~~~~btnModifyClicked');
        let {name} = this.nwParam;
        this.$emit('btnModifyClicked');
      },

    }
  }
</script>

<style scoped>

</style>
