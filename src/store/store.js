import actions from './actions'
import getters from './getters'
import mutations from './mutations'

import Vue from 'vue'
import Vuex from 'vuex' //npm install --save vuex
Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    site: {},

    rootDev: {id: -1, name: '我的设备', children: [], vars: []},

    copyData: {type: '', data: ''},

    ipAddr: undefined,
    port: 8888,
    opMode: "add",
    tempData: {},

    isYunServerWeb: true,
    yunServerNet: {
      cfg: {
        port: 9000,
      },
      his: {
        port: 9001,
      },
      real: {
        port: 8082,
      }
    },

    varIdPool: [],

    token: '',
    user: undefined,
    evts: [],

    cntPerRowInDevs: 1,
    cntPerRowInEvts: 1,

    networkCards: [],
  },

  getters: getters,
  mutations: mutations,
  actions: actions
});
