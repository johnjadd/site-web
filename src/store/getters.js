export default {
  site(state) {
    return state.site;
  },

  siteId(state) {
    return state.site.id;
  },

  rootDev(state) {
    return state.rootDev;
  },

  token(state) {
    return state.token;
  },

  user(state) {
    return state.user;
  },

  ipAddr(state) {
    return state.ipAddr;
  },

  port(state) {
    return state.port;
  },

  /*wndMode(state) {
    return state.wndMode;
  },*/

  opMode(state) {
    return state.opMode;
  },

  copyData(state) {
    return state.copyData;
  },

  tempData(state) {
    return state.tempData;
  },
  varIdPool(state) {
    return state.varIdPool;
  },

  /*
  devIdPool(state) {
    return state.devIdPool;
  },
  gDevIdPool(state) {
    return state.gDevIdPool;
  },*/

  evts(state) {
    return state.evts;
  },

  cntPerRowInDevs(state) {
    return state.cntPerRowInDevs;
  },

  cntPerRowInEvts(state) {
    return state.cntPerRowInEvts;
  },

  networkCards(state) {
    return state.networkCards;
  },

  isYunServerWeb(state) {
    return state.isYunServerWeb;
  },
  yunServerNet(state) {
    return state.yunServerNet;
  },
};
