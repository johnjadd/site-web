<template>
  <el-card v-if="evt" style="" :body-style="{padding: '0px'}">

    <el-row style="background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
      <span>{{evt.name}}</span>
      <span style="float: right">{{ new Date(evt.time) | moment("from") }}</span>
    </el-row>

    <div style="padding: 10px; font-size: 15px; font-weight: 200">
      <div style="margin-bottom: 5px" @click="">
        来源：{{getFullDevName(evt.devId)}}
      </div>

      <div style="margin-bottom: 5px">
        时间：{{ new Date(evt.time) | moment("YYYY-MM-DD HH:mm:ss") }}
      </div>

      <!--<div style="margin-bottom: 5px" >
        <span @click="goCurrentEvt(evt.devId)">
          <el-tag>详细</el-tag>
        </span>

      </div>-->
    </div>

  </el-card>

  <div v-else>

  </div>
</template>


<script>
  import utils from "../../mixins/utils"
  import routers from "../../mixins/routers"

  export default {
    name: 'EvtCard',
    components: {},

    props: {
      evt: undefined,
    },

    mixins: [
      utils,
      routers,
    ],

    data() {
      return {

      }
    },

    created() {

    },

    watch: {

    },

    methods: {
      confirmClicked() {
        let {id} = this.evt;
        this.$emit('confirmed', id);
      },

      /*goVar() {
        let {id} = this.evt;
        this.$emit('goVar', id);
      },*/
    },
  }
</script>

<style>

</style>
