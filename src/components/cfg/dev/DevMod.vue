<template>
  <el-form v-model="devl" label-width="80px">
    <el-form-item label="ID">
      <!--<el-input v-model="devl.id" :disabled="true"></el-input>-->
      <el-select v-model="devl.id" placeholder="无可用ID，无法创建"
                 size="large"
                 :disabled="modex === 'mod'">
        <el-option
          v-for="item in optIds"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
      &nbsp&nbsp可用ID总数量: <U>{{$store.getters.site.maxDevCnt}}</U> 已用: <U>{{getAllDevs().length-1}}</U>
    </el-form-item>

    <el-form-item label="名称">
      <el-input v-model="devl.name"></el-input>
    </el-form-item>

    <el-form-item label="父设备">
      <template>
        <el-select v-model="devl.fatherId" placeholder="Select" size="large">
          <el-option
            v-for="item in options"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
  import {mapGetters} from 'vuex'
  import utils from "../../../mixins/utils"

  export default {
    computed: {
      ...mapGetters({
        modex: "opMode",
        tempDatax: 'tempData'
      })
  },

  //只有在created后才能起作用，第一次创建时时不起作用的
  watch: {
    tempDatax() {
      this.init();
    }
  },

  created() {
    this.init();
  },

  mixins: [
    utils,
  ],

    data() {
    return {
      //caption: '修改设备属性',
      devl: "",
      options: [{id: '', name: ''}],
      optIds: [],
    }
  },

  methods: {
    init() {
      this.devl = this.tempDatax;

      if (this.modex === "add") {
        this.fillOptIds();
        this.devl.id = this.optIds[0];
        this.devl.children = [];
      }

      this.fillOptions(this.$store.getters.rootDev, this.devl.id);
    },

    fillOptions(startDev, endDevId) {
      this.options.splice(0);

      let devs = this.getAllDevs(startDev, endDevId);
      devs.forEach(dd => {
        if ((dd.id !== this.devl.id) && (!this.isRootDev(dd))) {
        this.options.push(dd);
      }
    });
    },

    fillOptIds() {
      let ids = this.getNewDevIds();
      let cnt = Math.min(20, ids.length);
      this.optIds = ids.slice(0, cnt);
      //let cnt = ids.length;
      //this.optIds = ids;
    },
  }
  }

</script>

<style scoped>

</style>
