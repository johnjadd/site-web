<template>

  <div v-if="devl === undefined">
    <small>获取数据失败！</small>
  </div>

  <div v-else>
    <el-row style="display: flex; margin-bottom: 5px; height: 30px">
      <div style="margin-left: 0px; flex: 1; padding: 5px;">
        <DevLevelBar></DevLevelBar>
      </div>

      <span style="float: right; margin-right: 10px;">
        <el-tag size="medium" type="info">变量总数: {{tbData.length}}</el-tag>
        <el-tag size="medium" type="info">开关量: {{boolVarCnt}}</el-tag>
      </span>

      <span style="float: right;">
       <el-button-group v-loading.body="$store.getters.fullscreenLoading">
          <el-button icon="plus" size="small" type="primary" @click="add(-1)">
            添加
          </el-button>
          <el-button size="small" type="" @click="backToDev">
            返回设备
          </el-button>
        </el-button-group>
      </span>
    </el-row>

    <div style="margin: 8px">
      <el-table v-loading.body="$store.getters.fullscreenLoading"
                :data="tbData"
                stripe
                style="width: 100%; margin-top: 5px;">
        <el-table-column
          prop="id"
          label="ID"
          sortable width="80">
        </el-table-column>

        <el-table-column
          prop="type"
          label="类型"
          sortable width="80">
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{ scope.row.type === 0? '模拟量': '开关量' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="name"
          label="名称"
          sortable>
        </el-table-column>

        <el-table-column
          prop="unit"
          label="单位"
          sortable width="100">
        </el-table-column>

        <el-table-column
          prop="calMethod"
          label="计算方法"
          sortable width="100">
        </el-table-column>

        <el-table-column
          prop="calParam"
          label="计算参数"
          sortable max-width="240">
          <template slot-scope="scope">
            <el-row style="margin-left: 0"
                  v-for="(varname, index) in stringifyCalParamInVarNames(parseCalParam(scope.row.calParam)).split(',')"
                  :key="index">{{varname}}</el-row>
          </template>
        </el-table-column>

        <el-table-column
          prop="chief"
          label="重要性"
          sortable width="180">
          <template slot-scope="scope">
            <el-rate
              disabled
              v-model="scope.row.chief"
              :colors="['#99A9BF', '#F7BA2A', '#FF9900']">
            </el-rate>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <div>
              <el-button type="text" icon="el-icon-edit" @click="mod(scope.row.index)"></el-button>
              <el-button type="text" icon="el-icon-plus" @click="add(scope.row.index)"></el-button>
              <el-button type="text" icon="el-icon-delete" @click="scopeRowIndex = scope.row.index;
                         dialogClickOk = false; dialogVisible = true;">
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="警告" :visible.sync="dialogVisible" width="30%" @close="del(scopeRowIndex)">
      <span>您确定要删除该变量吗？注意：操作不可逆！</span>
      <span slot="footer" class="dialog-footer">
      <el-button-group>
        <el-button size="small" @click="dialogVisible=false">取 消</el-button>
        <el-button size="small" type="primary" @click="dialogClickOk=true; dialogVisible=false;">确 定</el-button>
    </el-button-group>
    </span>
    </el-dialog>

    <el-dialog title="变量属性" :visible.sync="dialogFormVisible">
      <template-var-mod></template-var-mod>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel()">取 消</el-button>
        <el-button type="primary" @click="dialogOk()">确 定</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
  import {mapGetters} from 'vuex'

  import VarMod from "./VarMod"
  import DevLevelBar from "../../dev/DevLevelBar"

  import utils from "../../../mixins/utils"
  import apis from "../../../mixins/apis"
  import idMaps from "../../../mixins/idMaps"
  import routers from "../../../mixins/routers"

  export default {
    components: {
      'templateVarMod': VarMod,
      DevLevelBar,
    },

    mixins: [
      utils,
      apis,
      idMaps,
      routers,
    ],

    computed: {
      ...mapGetters({
        modex: "opMode",
        tempDatax: 'tempData',
      })
    },

    data() {
      return {
        tbData: [],
        dialogVisible: false,
        dialogClickOk: false,
        scopeRowIndex: -1,
        boolVarCnt: 0,

        dialogFormVisible: false,
        intervalId: '',

        devl: undefined,
        parents: [],
      }
    },

    watch: {
      '$route'(to, from) {
        //console.log(`~~~~~~~~~~~ route from ${from.path} to ${to.path}`);
        if(to.name==='cfg_var') {
          this.refreshCurrentDev();
        }
      },
    },

    created() {
      this.refreshCurrentDev();
    },

    methods: {
      backToDev() {
        let {parents} = this;
        if (parents.length > 1) {
          parents.pop();
        }
        this.goDevCfg(parents[parents.length - 1].id);
      },

      /*goDev(devId) {
        this.$router.push({name: 'cfg_dev', params: {devId}});
      },*/

      refreshCurrentDev() {
        let {devId} = this.$route.params;
        let {dev, parents} = this.getDevAndPath(devId);
        this.devl = dev;
        this.parents = parents;
        if (this.devl !== undefined) {
          this.fillTableData(this.devl);
        }
      },

      fillTableData(dev) {
        this.tbData.splice(0);
        let index = 0;
        let datas = dev.vars;
        this.boolVarCnt = 0;

        if (datas !== undefined) {
          datas.forEach(item => {
            let data = JSON.parse(JSON.stringify(item));

            data.index = index++;
            data.devId = dev.id;
            data.devName = dev.name;
            data.value = item.value;

            if (data.type === 1) {
              this.boolVarCnt++;
            }
            this.tbData.push(data);
          });
        }
      },

      add(index) {
        let data = {id: 0};
        if (index >= 0) {
          data = JSON.parse(JSON.stringify(this.tbData[index]));
          if(data.calMethod !== "") {
            data.calParam = this.parseCalParam(data.calParam);
          }
          //this.formatParamForMod(data);
          //data.calParam = this.formatParamForMod(data);
        }
        data = this.standardizeVar(data, this.devl);
        console.log("add " + JSON.stringify(data));

        this.$store.commit('setTempData', data);
        this.$store.commit("setOpMode", "add");

        this.dialogFormVisible = true;
      },

      mod(index) {
        let data = JSON.parse(JSON.stringify(this.tbData[index]));
        if(data.calMethod !== "") {
          data.calParam = this.parseCalParam(data.calParam);
        }
        //this.formatParamForMod(data);
        //data.calParam = this.formatParamForMod(data);

        this.$store.commit('setTempData', data);
        this.$store.commit("setOpMode", "mod");

        this.dialogFormVisible = true;
      },

      /*formatParamForMod(varData) {
        let {calMethod, calParam} = varData;
        if (calMethod !== "") {
          if (calParam === undefined || calParam === null) {
            calParam = "";
          }

          let ids = calParam.split(",");
          varData.calParam = ids.filter(id => {
            return (id !== "")
          });
        }
      },

      formatParamForMod({calMethod, calParam}) {
        if(calMethod === "") {
          return calParm;
        }

        let ret = "";
        if (calParam === undefined || calParam === null) {
          return ret;
        }

        let ids = calParam.split(",");
        return ids.filter(id => {
          return (id !== "")
        });
      },*/

      parseCalParam(strCalParam) {
        if (strCalParam === undefined || strCalParam === null) {
          return [];
        }

        let ids = strCalParam.split(",");
        return ids.filter(id => {
          return (id !== "");
        });
      },

      stringifyCalParam(ids) {
        return ids.join(",");
      },

      stringifyCalParamInVarNames(ids) {
        let names = ids.map(id => {
          return this.getVarNameByFullId(id);
          //return id + "_xx";
        });

        return names.join(",");
      },

      del(index) {
        if (this.dialogClickOk) {
          let data = this.tbData[index];
          console.log(`~~~~~~~~~~~~~~ del data = ${JSON.stringify(data)}`);

          this.delVarFromApi(data, this.$store).then(ret => {
            if (ret === "failed") {
              alert("delDev failed!");
            } else {
              this.delVar(data);
              this.fillTableData(this.devl);
            }
          });
        }
      },

      dialogCancel() {
        this.dialogFormVisible = false;
      },

      dialogOk() {
        let data = this.standardizeVar(this.tempDatax, this.devl);
        let {calMethod, calParam} = data;

        if (calMethod !== "") {
          //data.calParam = calParam.join(",");
          data.calParam = this.stringifyCalParam(data.calParam);
        }

        if (this.modex === "mod") {
          this.patchVarFromApi(data, this.$store).then(ret => {
            if (ret === "failed") {
              alert("patchVar failed!");
            } else {
              this.modVar(data);
              this.fillTableData(this.devl);

              this.dialogCancel();
            }
          });
        } else if (this.modex === "add") {
          this.postVarFromApi(data, this.$store).then(ret => {
            if (ret === "failed") {
              alert("postVar failed!");
            } else {
              this.addVar(data);
              this.fillTableData(this.devl);

              this.dialogCancel();
            }
          });
        }
      },

    }
  }
</script>

<style scoped>

</style>
