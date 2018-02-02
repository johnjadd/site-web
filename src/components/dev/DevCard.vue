<template>
  <el-card v-if="devl" style="" :body-style="{padding: '0px'}">

    <el-row style="background-color: #ecf0f1; padding: 5px; color: #95a5a6; border-radius: 1px; line-height: 28px">
      <span style="margin-left: 8px">
        <el-badge is-dot class="evtDot" v-if="evtsOfMe.length >0" ></el-badge>
        {{devl.name}}
      </span>
    </el-row>

    <el-row style="height: 80px; padding: 10px; margin-bottom: 15px; display: flex">
      <span style="padding: 1px; flex: 1">

        <el-col :span="8" style="text-align: center;">
          <span v-if="devl.chiefVars.length > 0" @click="goVar(devl.id)">
            <el-row style="line-height: 30px; font-size: 15px; font-weight: 200; ">{{devl.chiefVars[0].name}}</el-row>
            <el-row style="line-height: 40px; font-size: 35px; font-weight: 200; ">{{devl.chiefVars[0].value}}</el-row>
          </span>
          <span v-else>
            <el-row style="line-height: 30px; font-size: 15px; font-weight: 200; ">无变量</el-row>
          </span>
        </el-col>

        <el-col :span="16">
          <span @click="goCurrentEvt(devl.id)">
            <el-row v-if="evtsOfMe.length + evtsOfChildren.length> 0"
                    style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
              <!--<el-col :span="16">
                <span v-if="evtCount > 0">{{evtCount}}条报警</span>
                <span v-else-if="evtCount + childrenEvtCount === 0">正常无报警</span>
                <span v-else>子设备有 {{childrenEvtCount}} 条报警</span>
              </el-col>
              <el-col :span="8" >

              </el-col>-->
              <el-tag size="mini" type="danger" style="border-radius: 6px; margin-right: 2px; margin-bottom: 2px;"
                      :key="evt.id"
                      v-for="evt in evtsOfMe.concat(evtsOfChildren).slice(0,3)">
                {{evt.name}}
              </el-tag>

              <el-tag size="mini" type="danger" style="border-radius: 6px; margin-right: 2px; margin-bottom: 2px;"
                      v-if="evtsOfMe.length + evtsOfChildren.length > 3">
                ...{{evtsOfMe.length + evtsOfChildren.length}}
              </el-tag>
            </el-row>

            <el-row v-else
                    style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
              <el-tag size="mini" type="success" style="border-radius: 6px; margin-bottom: 2px;">
                 无报警
              </el-tag>
            </el-row>
          </span>

          <span @click="goVar(devl.id)">
            <el-row v-for="(varl, index) in devl.chiefVars.slice(1)" :key="index"
                    style="margin-left: 25px; font-weight: 200; margin-bottom: 5px; border-bottom: 1px solid #ecf0f1; ">
              <el-col :span="16">{{varl.name}}</el-col>
              <el-col :span="8">{{varl.value}}{{varl.unit}}</el-col>
            </el-row>
          </span>

        </el-col>
      </span>
    </el-row>

    <el-row style="padding: 2px;" v-if="devl.childrenLength>0">
      <span @click="goDev(devl.id)">

        <span v-for="(child, index) in sortDevsByEvt(devl.children, evtsOfChildren).slice(0,3)" :key="index">

          <el-tag size="medium" type="info" style="border-radius: 10px; margin-right: 2px">
            <el-badge is-dot class="evtDot" v-if="child.myEvtCnt + child.myChildrenEvtCnt > 0"></el-badge>
            {{child.name}}
          </el-tag>
        </span>

        <el-tag size="medium" type="info" style="border-radius: 10px; margin-right: 2px" v-if="devl.children.length>3">
          ...{{devl.childrenLength}}
        </el-tag>
         <!--<el-button size="mini" style="float: right; " palin><i class="el-icon-menu"
                                                               style="color: #00643b"></i></el-button> -->
      </span>
    </el-row>

  </el-card>

  <div v-else>

  </div>
</template>


<script>
  import {mapGetters} from 'vuex'
  import utils from "../../mixins/utils"
  import routers from "../../mixins/routers"
  import ElRow from "element-ui/packages/row/src/row";

  export default {
    name: 'DevCard',
    components: {ElRow},

    computed: {
      ...mapGetters({
        evts: 'evts',
      })
    },

    props: {
      devl: {},
    },

    mixins: [
      utils,
      routers,
    ],

    data() {
      return {
        //evtCount: 0,
        //childrenEvtCount: 0,
        evtsOfMe: [],
        evtsOfChildren: [],
        //evtsl: [],
      }
    },

    created() {
      this.refreshEvtCount();
    },

    watch: {
      evts() {
        this.refreshEvtCount();
      },
      devl() {
        this.refreshEvtCount();
      },
    },

    methods: {
      refreshEvtCount() {
        let {evtsOfMe, evtsOfChildren} = this.getEvts(this.evts, this.devl);
        this.evtsOfMe = evtsOfMe;
        this.evtsOfChildren = evtsOfChildren;
        //this.evtsl = evtsOfMe.concat(evtsOfChildren);
      }
    },
  }
</script>

<style>
  .evtDot {
    margin-top: -10px;
    margin-left: -12px;
  }

</style>
