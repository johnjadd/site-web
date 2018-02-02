//import Vue from 'vue'

export default {
  methods: {
    mapDev2Local(dev) {
      //dev.id = this.getLocalDevId(dev.id, globalDevIdPool);
      this.replaceNullToSpaceInProps(dev);
      dev.vars.forEach((varx) => {
        this.mapVar2Local(varx);
      });

      if(dev.children === undefined) {
        return;
      }

      dev.children.forEach((child) => {
        let {id, name} = dev;
        child.fatherId = id;
        child.fatherName = name;
        this.mapDev2Local(child);
      });
    },

    mapDev2Global(dev) {
      //dev.id = this.getGlobalDevId(dev.id, globalDevIdPool);
      delete dev.fatherId;

      dev.vars.forEach((varx) => {
        this.mapVar2Global(varx);
      });

      if(dev.children) {
        dev.children.forEach((child) => {
          this.mapDev2Global(child);
        });
      }
    },

    mapVar2Local(varx) {
      let {varKey, devKey} = varx.id;
      varx.id = varKey;
      //varx.devId = this.getLocalDevId(devKey, globalDevIdPool);
      varx.devId = devKey;
      this.replaceNullToSpaceInProps(varx);
    },

    mapVar2Global(varx) {
      let varKey = varx.id;
      let devKey = varx.devId;
      //let devId = varx.devId;
      //let devKey = this.getGlobalDevId(devId, globalDevIdPool);
      varx.id = {varKey, devKey};
      delete varx.devId;
      delete varx.devName;
    },

    replaceNullToSpaceInProps(object) {
      Object.keys(object).forEach(key => {
        if (object[key] === null) {
          object[key] = "";
        }
      });
    },

    mapEvt2Local(evts) {
      if(evts === undefined) return;
      //console.log( `mapEvt2Local evts = ${JSON.stringify(evts)}`);
      evts.forEach((evt) => {
          evt.id= evt.i;
          evt.time= evt.t;
          evt.name= evt.n;
          evt.devId= evt.di;
          evt.varId= evt.vi;
          evt.confirmed= evt.c;
          evt.confirmedTime= evt.ct;
          evt.confirmedInfo= evt.cf;
          evt.value = evt.v;
          if(evt.rt !== undefined) {
            evt.recoveredTime = evt.rt;
          }
          if(evt.du !== undefined) {
            evt.duration = evt.du;
          }

          delete evt.i;
          delete evt.t;
          delete evt.n;
          delete evt.di;
          delete evt.vi;
          delete evt.c;
          delete evt.ct;
          delete evt.cf;
          delete evt.rt;
          delete evt.v;
          delete evt.du;
      });

      //console.log( `mapEvt2Local evts = ${JSON.stringify(evts)}`);
      /*return evts.map((evt) => {
        return {
          id: evt.id,
          time: evt.t,
          name: evt.n,

          devId: evt.di,
          varId: evt.vi,

          confirmed: evt.c,
          confirmedTime: evt.ct,
          confirmedInfo: evt.cf,
          recoveredTime: evt.rt,
        }
      });*/


    },

    /*getGlobalDevId(localId, globalDevIdPool) {
      let gid = -1;

      gid = globalDevIdPool.find((id, index) => {
        return (index === localId);
      });

      return (((gid === -1) || (gid === undefined))? localId: gid);
    },

    getLocalDevId(globalId, globalDevIdPool) {
      if(globalId < 0) return globalId;

      let lid = -1;

      lid = globalDevIdPool.findIndex((id) => {
        return (id === globalId)
      });

      return (((lid === -1) || (lid === undefined))? globalId: lid);
    },*/

  }
}
