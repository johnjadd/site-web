<template>
  <div style="margin: 0px">
    <div v-if="evts === undefined">
      <small>获取数据失败！</small>
    </div>

    <div v-else>
      <el-row style="display: flex; margin-bottom: 5px; height: 30px; width: 100%">
        <div style="flex: 1;">
        </div>

        <div style="width: 100px;  margin-left: 20px">
          <el-slider v-model="cntPerRow" :min="1" :max="6" :format-tooltip="slideToolTip"></el-slider>
        </div>

        <!--<el-button @click="goEvtHis" style="padding: 5px; margin-left: 20px" type="info" plain>
            历史报警<i class="el-icon-arrow-right"></i>
          </el-button>-->
      </el-row>

      <div v-if="evts.length===0" style="text-align: center;">
        <span style="font-size: 16px; font-weight: 300;">系统无消息</span>
      </div>

      <div v-else>
        <el-row v-for="(o, index) in rowCnt" :key="index" type="flex" style="padding: 0px" :gutter="10">
          <el-col :span="12" v-for="(evt, index) in evts.slice((index)*cntPerRow, (index+1)*cntPerRow)" :key="evt.id" style="flex: 1; margin-bottom: 10px;">
            <evt-card :evt="evt"
                      v-on:confirmClicked=""
                      v-on:goVar="">
            </evt-card>

          </el-col>

        </el-row>
      </div>


    </div>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import EvtCard from './EvtCard'

  import utils from "../../mixins/utils"
  import apis from "../../mixins/apis"
  import routers from "../../mixins/routers"

  export default {
    components: {
      EvtCard,
    },

    computed: {
      ...mapGetters({
        evts: 'evts',
        cntPerRowInEvts: 'cntPerRowInEvts',
      }),

      rowCnt() {
        return  Math.ceil(this.evts.length/this.cntPerRow);
      },
    },

    watch: {
    },

    created() {
      this.cntPerRow = this.cntPerRowInEvts;
    },

    beforeDestroy() {
      this.$store.commit('setCntPerRowInEvts', this.cntPerRow);
    },

    data() {
      return {
        cntPerRow:4,
        //rowCnt: 3,
      }
    },

    mixins: [
      //utils,
      //apis,
      routers,
    ],

    methods: {
      slideToolTip() {
        return ('每行显示' + this.cntPerRow + '个')  ;
      },
    }
  }
</script>

<style scoped>

</style>
