<template>
  <el-card v-if="data" style="" :body-style="{padding: '0px'}">
    <el-row style="background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
      <span>云服务器配置</span>
      <el-button size="mini" style="float: right; " palin @click="btnModClicked">
        <i class="el-icon-edit" style="color: #00643b"></i>
        修改
      </el-button>
    </el-row>

    <div style="margin-top: 10px">
      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">地址: </el-col>
        <el-col :span="8" >
          <span style="margin-right: 10px">{{data.ip}}:{{data.port}}</span>
          <el-button size="mini" type="text" style="padding: 0px" @click="btnTestClicked">测试</el-button>
        </el-col>
      </el-row>

      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">状态: </el-col>
        <el-col :span="8" ></el-col>
      </el-row>

      <el-row style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
        <el-col :span="8">上传设备定义: </el-col>
        <el-col :span="8" >
          <el-button size="mini" type="text" style="padding: 0px" @click="btnUploadDevClicked">确定</el-button>
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
      data: undefined,
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
        this.$emit('btnModClicked');
      },

      btnTestClicked() {
        console.log('~~~~~~~~~~~~~~~~~~~~btnTestClicked');
      },

      btnUploadDevClicked(){
        this.$emit('btnUploadDevClicked');
      },

    }
  }
</script>

<style scoped>

</style>
