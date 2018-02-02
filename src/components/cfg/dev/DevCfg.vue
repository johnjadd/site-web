<template>
  <div v-if="devx === undefined">
    <small>获取数据失败！</small>
  </div>

  <div v-else>
    <el-row style="display: flex; margin-bottom: 5px; height: 30px">
      <div style="margin-left: 0px; flex: 1; padding: 5px;">
        <DevLevelBar></DevLevelBar>
      </div>

      <span style="float: right; margin-right: 10px;">
        <el-tag size="medium" type="info">子设备总数: {{getAllChildren(devx).length}}</el-tag>
        <el-tag size="medium" type="info">当前页: {{tbData.length}}</el-tag>
      </span>

      <span style="float: right;">
        <el-button-group v-if="!isRootDev(devx)">
          <el-button size="small" type="primary"
                     @click="add(-1)"
                     :disabled="devx.id === undefined"
                     icon="plus">
            添加
          </el-button>
          <el-button size="small" type="primary" @click="paste"
                     :disabled="!anythingInCdata">粘贴</el-button>
          <el-button size="small" type="" @click="parents.pop(); goDevCfg(parents[parents.length-1].id);"
                     :disabled="isRootDev(devx)">返回父设备</el-button>
        </el-button-group>
      </span>
    </el-row>

    <div style="margin: 8px">
      <el-table :data="tbData"
                stripe
                style="width: 100%">

         <el-table-column label="ID" width="80"
                         prop="id" sortable>
          <template slot-scope="scope">
            <span style="margin-left: 0px">{{scope.row.id }}</span>
          </template>
        </el-table-column>

        <el-table-column label="名称"
                         prop="name" sortable>
          <template slot-scope="scope">
          <span @click="goDevCfg(scope.row.id)">
            <el-button v-if="scope.row.childrenLength>0" size="mini" type="info" plain
                       style="padding: 5px">+{{scope.row.childrenLength}}</el-button>
            <span>{{scope.row.name}}</span>
          </span>
          </template>
        </el-table-column>

        <el-table-column label="变量"
                         prop="varsLength" sortable>
          <template slot-scope="scope">

          <span @click="goVarCfg(scope.row.id);">
            <el-button v-if="scope.row.varsLength===0" size="mini" type="info" plain style="padding: 5px">
              添加变量
            </el-button>
            <el-button v-if="scope.row.varsLength>0" size="mini" type="info" plain
                       style="padding: 5px">+{{scope.row.varsLength}}</el-button>
            <span size="small" style="margin-left: 0px" v-for="(varl, index) in scope.row.chiefVars">
              {{varl.name}}
              <span v-if="index<scope.row.chiefVars.length-1">,</span>
              <span v-else-if="scope.row.chiefVars.length < scope.row.varsLength">...</span>
            </span>
          </span>

          </template>
        </el-table-column>

        <el-table-column label="操作" width="160">
          <template slot-scope="scope">
            <div>
              <el-button type="text" @click="mod(scope.row.index)"><i class="el-icon-edit"></i></el-button>
              <el-button type="text" @click="add(scope.row.index)" v-if="!isRootDev(devx)"><i class="el-icon-plus"></i>
              </el-button>
              <el-button type="text" @click="scopeRowIndex = scope.row.index;
                         dialogClickOk = false; dialogVisible = true;"
                         v-if="!isRootDev(devx)"><i class="el-icon-delete"></i></el-button>
              <el-button type="text" @click="copy(scope.row.index)" v-if="!isRootDev(devx)">拷贝</el-button>
            </div>
          </template>
        </el-table-column>

      </el-table>
    </div>

    <el-dialog title="警告" :visible.sync="dialogVisible" @close="del(scopeRowIndex)" width="30%">
      <span>您确定要删除该设备吗？注意：所有的子设备会被删除！所有操作不可逆！</span>
      <span slot="footer" class="dialog-footer">
        <el-button-group>
          <el-button size="small" @click="dialogVisible=false">取 消</el-button>
          <el-button size="small" type="primary" @click="dialogClickOk=true; dialogVisible=false;">确 定</el-button>
        </el-button-group>
      </span>
    </el-dialog>

    <el-dialog title="设备属性" :visible.sync="dialogFormVisible">
      <template-dev-mod></template-dev-mod>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogCancel">取 消</el-button>
        <el-button type="primary" @click="dialogOk">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'

  //import Vars from '../../dev/Vars'
  import DevMod from './DevMod'
  import DevLevelBar from '../../dev/DevLevelBar'

  import utils from "../../../mixins/utils"
  import apis from "../../../mixins/apis"
  import routers from "../../../mixins/routers"

  export default {
    components: {
      'templateDevMod': DevMod,
      DevLevelBar,
    },

    computed: {
      ...mapGetters({
        cDatax: "copyData",
        tempDatax: 'tempData',
        modex: "opMode",
      }),
    },

    watch: {
      '$route'(to, from) {
        //console.log(`~~~~~~~~~~~ route from ${from.path} to ${to.path}`);
        if (to.name === 'cfg_dev') {
          this.refreshCurrentDev();
        }
      },
      cDatax() {
        this.anythingInCdata = false;
        if (this.cDatax.type !== undefined) {
          if (this.cDatax.type === "dev") {
            this.anythingInCdata = true;
          }
        }
      },
    },

    created() {
      this.refreshCurrentDev();
    },

    data() {
      return {
        tbData: [],

        dialogVisible: false,
        dialogClickOk: false,
        scopeRowIndex: -1,

        anythingInCdata: false,

        dialogFormVisible: false,

        devx: undefined,
        parents: [],
      }
    },

    mixins: [
      utils,
      apis,
      routers,
    ],

    methods: {
      handleNodeClick(data) {
        console.log(data);
      },

      refreshCurrentDev() {
        let {devId} = this.$route.params;

        let devAndPath = this.getDevAndPath(devId);
        if (devAndPath === undefined) return;

        let {dev, parents} = devAndPath;
        this.devx = dev;
        this.parents = parents;

        if (this.devx === undefined) return;

        this.fillTableData(this.devx.children);
      },

      fillTableData(data) {
        this.tbData.splice(0);
        let index = 0;

        if (data !== undefined) {
          data.forEach(item => {
            let dev = JSON.parse(JSON.stringify(item));

            dev.index = index++;
            dev.status = "normal";
            dev.fatherName = item.fatherName;
            dev.childrenLength = item.children.length;
            dev.varsLength = item.vars.length;
            dev.fatherId = item.fatherId;
            dev.chiefVars = this.getChiefVars(item, 3);
            //data.children = []; //清空子设备
            this.tbData.push(dev);
          });

          console.log("fillTableData finished!");
        }
      },

      getDevFromTbData(index) {
        if (this.devx === undefined) return undefined;
        if (this.devx.children === undefined) return undefined;
        return this.devx.children[index];
      },

      copy(index) {
        let dev = this.getDevFromTbData(index);
        if (dev === undefined) return;

        let cdata = {type: '', data: ''};
        cdata.type = "dev";
        cdata.data = JSON.stringify(dev);
        this.$store.commit("copy", cdata);
      },

      paste() {
        let cdata = this.cDatax;
        if (cdata.type !== "dev") return;

        let data = JSON.parse(cdata.data);
        if (!this.renewAllIds(data)) {
          alert("Paste failed! You need more available devices ids.");
          return;
        }
        data.fatherId = this.devx.id;

        console.log("paste dev = " + JSON.stringify(data));

        this.postDevFromApi(data, this.$store).then(ret => {
          if (ret === "failed") {
            alert("postDev failed!");
          } else {
            console.log("~~~~~~~~~~~~ paste dev  = " + JSON.stringify(data));
            this.addDev(data);
            this.fillTableData(this.devx.children);
          }
        });
      },

      mod(index) {
        let data = JSON.parse(JSON.stringify(this.tbData[index]));
        this.$store.commit('setTempData', data);
        this.$store.commit("setOpMode", "mod");

        this.dialogFormVisible = true;
        //this.emitShowWndMsg("mod");
      },

      add(index) {
        let data = {id: 0};
        if (index >= 0) {
          data = this.tbData[index];
        }
        data = this.standardizeDev(data);
        data.fatherId = this.devx.id;
        data.fatherName = this.devx.name;

        this.$store.commit('setTempData', data);
        this.$store.commit("setOpMode", "add");

        this.dialogFormVisible = true;
        //this.emitShowWndMsg("add");
      },

      del(index) {
        if (this.dialogClickOk) {
          let data = this.devx.children[index];

          this.delDevFromApi(data, this.$store).then(ret => {
            if (ret === "failed") {
              alert("delDev failed!");
            } else {
              this.delDev(data);
              this.fillTableData(this.devx.children);
            }
          });
        }
      },

      dialogCancel() {
        this.dialogFormVisible = false;
      },

      dialogOk() {
        let data = this.standardizeDev(this.tempDatax);

        if (this.modex === "mod") {
          this.patchDevFromApi(data, this.$store).then(ret => {
            if (ret === "failed") {
              alert("pachDev failed!");
            } else {
              this.modDev(data);
              this.fillTableData(this.devx.children);
              this.dialogCancel();
            }
          });
        } else if (this.modex === "add") {
          this.postDevFromApi(data, this.$store).then(ret => {
            if (ret === "failed") {
              alert("postDev failed!");
            } else {
              this.addDev(data);
              this.fillTableData(this.devx.children);
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
