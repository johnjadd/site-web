<template>
  <el-form v-model="varl" label-width="80px">
    <el-form-item label="ID">
      <el-select v-model="varl.id" placeholder="无可用ID，无法创建"
                 size="large"
                 :disabled="modex=='mod'">
        <el-option
          v-for="item in optIds"
          :key="item"
          :label="item"
          :value="item">
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="名称">
      <el-input v-model="varl.name"></el-input>
    </el-form-item>

    <el-form-item label="类型">
      <el-row>
        <template>
          <el-select v-model="varl.type" placeholder="" size="large">
            <el-option
              v-for="item in typeOpts"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>

        <span>单位
          <template>
            <el-select v-model="varl.unit"
                       filterable
                       allow-create
                       placeholder="" size="large">
              <el-option
                v-for="item in unitOpts"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </template>
        </span>
      </el-row>
    </el-form-item>

    <el-form-item label="计算方法">
      <template>
        <el-select v-model="varl.calMethod" placeholder="" size="large">
          <el-option
            v-for="item in calMethodOpts"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </template>
    </el-form-item>

    <el-form-item label="计算变量">
      <span v-if="varl.calMethod!==''">
        <el-cascader :options="fillDevSelect().children"
                     :props="{value:'id', label: 'name', children: 'children'}"
                     v-model="devSelected"
                     :show-all-levels="false"
                     :change-on-select="true">
        </el-cascader>

        <el-select v-model="varl.calParam" placeholder="请选择" size="large"
                   multiple
                   filterable
                   v-if="devSelected.length>0">
          <el-option
            v-for="item in calVarOpts"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </span>

      <el-input v-model="varl.calParam" v-else></el-input>
    </el-form-item>

    <el-form-item label="重要性">
      <template>
        <!-- `checked` 为 true 或 false -->
        <!--<el-checkbox v-model="varl.chief">
          <<el-icon name="star-on" v-if="varl.chief"></el-icon>
          <el-icon name="star-off" v-else></el-icon>
        </el-checkbox>-->

        <el-rate
          v-model="varl.chief"
          :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
        </el-rate>
      </template>
    </el-form-item>

  </el-form>
  <!--</el-card>-->
</template>

<script>
  import {mapGetters} from 'vuex'
  import utils from "../../../mixins/utils"
  import idMaps from "../../../mixins/idMaps"
  import ElRow from "element-ui/packages/row/src/row";
  import ElFormItem from "../../../../node_modules/element-ui/packages/form/src/form-item.vue";

  export default {
    components: {
      ElFormItem,
      ElRow},
    computed: {
      ...mapGetters({
        modex: "opMode",
        tempDatax: 'tempData',
      })
    },

    mixins: [
      utils,
      idMaps,
    ],

    data() {
      return {
        caption: "修改变量属性",
        varl: {},

        typeOpts: [
          {value: 1, label: '开关量'},
          {value: 0, label: '模拟量'}
        ],
        calMethodOpts: [
          {id: 0, value: '', label: '本地变量'},
          {id: 1, value: 'max', label: '最大'},
          {id: 2, value: 'min', label: '最小'},
          {id: 3, value: 'avg', label: '平均'},
          {id: 4, value: 'sum', label: '总和'},
          {id: 5, value: 'and', label: '与'},
          {id: 6, value: 'or', label: '或'}
        ],
        unitOpts: [],
        calVarOpts: [],
        optIds: [],

        devSelected: [0],
      }
    },

    //只有在created后才能起作用，第一次创建时时不起作用的
    watch: {
      tempDatax() {
        this.refreshData();
      },
      devSelected() {
        this.devSelectedChange();
      }
    },

    created() {
      let units = ",℃,℉,%,A,V,kv,W,kw,kwh,kva";
      units.split(',').forEach(unit => {
        this.unitOpts.push({value: unit, label: unit});
      });

      this.refreshData();
    },

    methods: {
      devSelectedChange() {
        let devId = -1;
        if (this.devSelected.length > 0) {
          devId = this.devSelected[this.devSelected.length - 1];
        }

        let dev = this.getDev(devId);
        this.fillCalVarOpts(dev);
      },

      /*refreshParam() {
        this.varl = this.tempDatax;
        let {calMethod, calParam} = this.varl;

        let param = "";
        if (calMethod === "") {
          param = this.localId;
          console.log(`param = ${param}`)
        } else {
          //param = String(JSON.stringify(this.calVarIds));
          //param = param.slice(1, param.length-1);
          let paramx = this.calVarIds.map((pa) => {
            let ids = this.seperateVarId(pa);
            return (ids.devId + "." + ids.varNum);
          });

          //param = this.calVarIds.join();
          param = paramx.join();
        }
        this.varl.calParam = param;
      },*/

      refreshData() {
        this.varl = this.tempDatax;
        let {parents} = this.getDevAndPath(this.varl.devId);

        this.devSelected.splice(0);
        parents.forEach(dev => {
          if (dev.id !== -1) {
            this.devSelected.push(dev.id);
          }
        });

        this.fillOptIds();
        if (this.modex === "add") {
          this.varl.id = this.optIds[0];
        }

        this.fillCalVarOpts();
      },

      fillCalVarOpts(dev) {
        this.calVarOpts.splice(0);

        let devl = this.getDev(this.varl.devId);
        let devs = this.getAllDevs(dev);
        //let opts = [];
        devs.forEach(dd => {
          dd.vars.forEach(vv => {
            if (dd.id !== devl.id || vv.id !== this.varl.id) {
              let data = {name: "[" + dd.name + "] " + vv.name, id: this.getVarIdInStr(vv)};
              this.calVarOpts.push(data);
            }
          });
        });

        /*this.calVarOpts.sort((first, second) => {
          if(first > second)
            return 1;
          if(first < second)
            return -1;
          return 0;
        });*/
      },

      fillDevSelect() {
        let root = JSON.parse(JSON.stringify(this.$store.getters.rootDev));
        let devs = this.getAllDevs(root);
        devs.forEach(dev => {
          if (dev.children.length === 0) {
            delete dev.children;
          }
        });
        return root;
      },

      fillOptIds() {
        let ids = this.getNewVarIds(this.varl.devId);
        let cnt = Math.min(30, ids.length);
        this.optIds = ids.slice(0, cnt);
      },
    }
  }

</script>

<style scoped>

</style>
