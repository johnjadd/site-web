//use $store.commit('methodName', payload) to do mutations
export default {
  setSite(state, site) {
    if(site === undefined) {
      site = {id: null, maxDevCnt: 0, maxVarCnt: 0}
    }

    state.site = site;

    let {varIdPool} = state;
    //fill devIdMap
    //devIdPool.splice(0);
    //gDevIdPool.splice(0);

    //let maxDevCnt = site.maxDevCnt;
    //for (let index = 0; index < maxDevCnt; index++) {
    //  devIdPool.push(index);
      //gDevIdPool.push(-1);
    //}

    /*let idMaps = site.idMaps;
    if(idMaps) {
      idMaps.forEach((idmap) => {
        if (idmap.lDevId < maxDevCnt) {
          gDevIdPool[idmap.lDevId] = idmap.gDevId;
        }
      });
    }*/

    varIdPool.splice(0);
    for (let index = 0; index < (1 << 8); index++) {
      varIdPool.push(index);
    }
    console.log(`var id Pool = ${JSON.stringify(varIdPool)}`);
  },

  setRootDev(state, data) {
    let {rootDev} = state;
    rootDev.children = data;
  },

  setToken(state, data) {
    state.token = data;
  },

  setUser(state, data) {
    console.log(`~~~~~~~~ store setUser data = ${JSON.stringify(data)}`);
    state.user = data;
  },

  /*setWndMode(state, mode) {
    state.wndMode = mode;
  },*/

  setIpAddr(state, data) {
    state.ipAddr = data;
  },

  setOpMode(state, modex) {
    state.opMode = modex;
  },

  copy(state, data) {
    state.copyData = data;
  },

  setTempData(state, data) {
    state.tempData = data;
  },

  setEvts(state, data){
    state.evts = data;
  },

  setCntPerRowInDevs(state, data) {
    state.cntPerRowInDevs = data;
  },

  setCntPerRowInEvts(state, data) {
    state.cntPerRowInEvts = data;
  },

  setNetworkCards(state, data) {
    state.networkCards = data;
  }

};
