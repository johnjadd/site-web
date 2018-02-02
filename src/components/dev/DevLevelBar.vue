<template>
  <el-breadcrumb separator="" class="app-levelbar"
                 style="text-align: left; width: 100%; height: 20px; line-height: 20px">
    <el-breadcrumb-item v-for="(parent, index) in parents"
                        :key="index">

      <el-button v-if="index < parents.length-1" size="medium" type="text"
                 @click="$router.push((index<parents.length-1)?{name: routerName, params:{devId: parent.id}}: {})"
                 style="padding: 0px">
        {{parent.name}}
      </el-button>
      <span v-else style="font-size: 14px; color: gray">{{parent.name}}</span>

      <el-dropdown v-if="getDropDownDevs(parent).length>1" type="text"
                   trigger="click" :hide-on-click="true"
                   @command="handleDropDown">
        <span class="el-dropdown-link">
          <el-button size="mini" style="padding: 1px" type="text"><i class="el-icon-arrow-down"></i></el-button>
        </span>

        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item v-for="(dev,index) in getDropDownDevs(parent)" :key="dev.id"
                            :command="dev">
            <span>{{dev.name}}</span>
          </el-dropdown-item>
        </el-dropdown-menu>

      </el-dropdown>

      <span>
        <el-button v-if="(getDropDownDevs(parent).length==1)" size="mini" style="padding: 1px" type="text"
                   @click="$router.push({name: routerName, params: {devId: parent.children[0].id}})">
          <i class="el-icon-arrow-right"></i>
        </el-button>
      </span>

    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import utils from "../../mixins/utils"

  export default {
    components: {},
    created() {
      //this.getBreadcrumb()
      this.refreshCurrentDev();
    },
    mixins: [
      utils,
    ],
    props: {

    },
    data() {
      return {
        parents: [],
        routerName: '',
      }
    },
    methods: {
      refreshCurrentDev() {
        let {devId} = this.$route.params;

        let devAndPath = this.getDevAndPath(devId);
        if (devAndPath === undefined) return;

        let {parents} = devAndPath;
        this.parents = parents;
      },

      getDropDownDevs(dev) {
        if(!dev) return [];
        if(this.routerName === 'dev') {
          return dev.children.filter(child => {
            return (child.children.length > 0);
          });
        }
        return dev.children;
      },

      handleDropDown(command) {
        //console.log('click on item ' + command);
        let {id} = command;
        this.$router.push({name: this.routerName, params: {devId: id}});
      }
    },
    watch: {
      '$route'(to, from) {
        //console.log(`~~~~~~~~~~~ route from ${from.name} to ${to.name}`);
        this.routerName = to.name;
        this.refreshCurrentDev();
      },

    }
  }
</script>

<style scoped>
  .app-levelbar {
    display: inline-block;
    font-size: 14px;
    margin-left: 0px;
  }
</style>


<!--
<el-breadcrumb-item v-for="(parent, index) in parents"
                    :to="(index<parents.length-1)?{path: '/dev/' + parent.id}: {} "
                    key="parent.id"
>

<el-button size="mini" style="padding: 2px"><i class="el-icon-arrow-right"></i></el-button>
-->
