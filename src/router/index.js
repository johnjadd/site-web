import Vue from 'vue'
import Router from 'vue-router'
Vue.use(Router);

import App from "@/App"
import Dev from "../components/dev/Devs.vue"
import Var from  "../components/dev/Vars.vue"
import VarInfoCard from "../components/dev/VarInfoCard.vue"
import VarHis from "../components/dev/VarHis.vue"
import SignIn from "../components/user/SignIn.vue"
import Layout from "../components/layout/Layout.vue"
import Evt from "../components/events/Events.vue"
import EvtHis from "../components/events/EventHis.vue"
import DevCfg from "../components/cfg/dev/DevCfg.vue"
import VarCfg from "../components/cfg/dev/VarCfg.vue"
import HardwareCfg from "../components/cfg/hardware/HardwareCfg.vue"
import ServerCfg from "../components/cfg/serverOnLine/ServerCfg.vue"
import Msg from "../components/messages/Messages.vue"
//import BedRoom from "../components/dev/BedRoom.vue"

const routes = [
  {path: '/', component: Dev, redirect: '/layout/dev/-1'},
  {path: '/layout/', component: Layout, name: 'layout',
    children: [
      {path: 'dev/:devId', component: Dev, name: 'dev'},
      {path: 'dev/:devId/evt/his', component: EvtHis, name: 'evt_his'},
      {path: 'dev/:devId/var', component: Var, name: 'var'},
      {path: 'dev/:devId/var/:varId', component: VarInfoCard, name: 'var_info'},
      {path: 'dev/:devId/var/:varId/his', component: VarHis, name: 'var_his'},
      {path: 'msg/', component: Msg, name: 'msg'},
      {path: 'dev/:devId/evt', component: Evt, name: 'evt'},
      //{path: 'dev/bedroom', component: BedRoom, name: 'bedroom'},


      {path: 'cfg/dev', redirect: 'cfg/dev/-1'},
      {path: 'cfg/dev/:devId', component: DevCfg, name: 'cfg_dev'},
      {path: 'cfg/dev/:devId/var', component: VarCfg, name: 'cfg_var'},
      {path: 'cfg/hardware', component: HardwareCfg, name: 'cfg_hardware'},
      {path: 'cfg/server', component: ServerCfg, name: 'cfg_server'},
    ]
  },
  {path: '/signIn', component: SignIn, name: 'signIn'}
];

const router = new Router({
  routes,
  //mode: "history" //delete the '#' in the url path
});

export default router;
