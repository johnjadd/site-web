export default {
  methods: {
    modDev(devData) {
      let oldParent = this.getParent(devData.id, undefined);
      let newParent = this.getDev(devData.fatherId, undefined);
      if (oldParent === undefined || newParent === undefined) return;

      let index = oldParent.children.length;

      while (index--) {
        let dd = oldParent.children[index];
        if (dd.id === devData.id) {
          this.copyUndefinedProps(dd, devData);
          if (oldParent.id === newParent.id) {
            oldParent.children.splice(index, 1, devData);
          } else {
            oldParent.children.splice(index, 1);
            newParent.children.push(devData);
          }

          console.log("modDev done!");
          break;
        }
      }
    },

    addDev(data) {
      let parent = this.getDev(data.fatherId, undefined);
      //console.log("addDev from data: " + JSON.stringify(data) + " to parent: " + parent.name);
      if (parent === undefined) return;

      data = this.standardizeDev(data);

      parent.children.push(data);
      console.log("addDev done!");
    },

    delDev(data) {
      let parent = this.getDev(data.fatherId, undefined);
      //console.log("delDev from data: " + JSON.stringify(data) + " in parent: " + parent);
      if (parent === undefined) return;

      let index = parent.children.length;
      while (index--) {
        if (parent.children[index].id === data.id) {
          //console.log("before parent children.length = " + parent.children.length + "");
          parent.children.splice(index, 1);
          //console.log("after  parent children.length = " + parent.children.length);
          console.log("delDev done!");
          break;
        }
      }
    },

    modVar(data) {
      let dev = this.getDev(data.devId, undefined);
      //console.log("modVar from data: " + JSON.stringify(data) + " in dev: " + dev.name);
      if (dev === undefined) return;

      let varx = this.getVar(data.id, dev);
      if (varx === undefined) return;

      let vars = dev.vars;
      let index = vars.length;
      while (index--) {
        if (vars[index].id === data.id) {
          this.copyUndefinedProps(vars[index], data);
          vars.splice(index, 1, data);
          console.log("modVar done!");
          break;
        }
      }
    },

    addVar(data) {
      let dev = this.getDev(data.devId, undefined);
      //console.log("addVar from data: " + JSON.stringify(data) + " to dev: " + data.name);
      if (dev === undefined) return;

      data = this.standardizeVar(data, dev);

      dev.vars.push(data);
      console.log("addVar done!");
    },

    delVar(data) {
      let dev = this.getDev(data.devId, undefined);
      //console.log("delVar from data: " + JSON.stringify(data) + " in dev: " + dev.name);
      if (dev === undefined) return;

      let vars = dev.vars;
      let index = vars.length;
      while (index--) {
        if (vars[index].id === data.id) {
          vars.splice(index, 1);
          console.log("delVar done!");
          break;
        }
      }
    },

    standardizeDev(data) {
      let ret;
      let sample = {
        name: 'newDev', localId: '',
        children: [], vars: []
      };
      //getNewDevIds will take some time
      if (data === undefined || data.id === undefined) {
        sample.id = this.getNewDevIds()[0];
      }
      if (data !== undefined) {
        ret = JSON.parse(JSON.stringify(data));
        this.copyUndefinedProps(sample, ret);
      } else {
        ret = sample;
      }
      //console.log("standardizeDev finished data = " + JSON.stringify(data));
      return ret;
    },

    standardizeVar(data, dev) {
      if (dev === undefined) return undefined;

      let ret;
      let sample = {
        name: 'newVar',
        type: 0, value: '0', time: new Date(),
        calMethod: '', calParam: '', devId: dev.id
      };
      if (data === undefined || data.id === undefined) {
        sample.id = this.getNewVarIds(dev)[0];
      }
      if (data !== undefined) {
        ret = JSON.parse(JSON.stringify(data));
        this.copyUndefinedProps(sample, ret);
      } else {
        ret = sample;
      }
      return ret;
    },

    renewAllIds(startDev) {
      let devs = this.getAllDevs(startDev, undefined);

      let index = devs.length;
      if (index === 0) return [];

      let ids = this.getNewDevIds(devs.length);
      if (ids.length < devs.length) {
        return false;
      }

      while (index--) {
        let dev = devs[index];
        dev.id = ids[index];
      }

      this.findFathers(startDev);
      return true;
    },

    getDev(devId, startDev) {
      if (devId === undefined) return undefined;
      if (startDev === undefined) {
        startDev = this.$store.getters.rootDev;
      }
      //if (parseInt(startDev.id) === parseInt(devId)) {
      //if((startDev.id + "") === (devId + "")) { //字符串比较
      if (this.stringEqual(startDev.id, devId)) {
        return startDev;
      }

      let index = startDev.children.length;
      while (index--) {
        let dev = this.getDev(devId, startDev.children[index]);
        if (dev !== undefined) {
          return dev;
        }
      }

      return undefined;
    },

    getDevAndPath(devId, startDev) {
      if (devId === undefined) return undefined;
      if (startDev === undefined) {
        startDev = this.$store.getters.rootDev;
      }
      let ret = {dev: startDev, parents: [{id: startDev.id, name: startDev.name, children: startDev.children}]};
      //if (parseInt(startDev.id) === parseInt(devId)) {
      //if((startDev.id + "") === (devId + "")) { //字符串比较
      if (this.stringEqual(startDev.id, devId)) {
        return ret;
      }

      let index = startDev.children.length;
      while (index--) {
        let devAndPath = this.getDevAndPath(devId, startDev.children[index]);
        if (devAndPath !== undefined) {
          let {dev, parents} = devAndPath;
          //parents = [{id: startDev.id, name: startDev.name}].concat(path);
          parents = ret.parents.concat(parents);
          ret = {dev, parents};
          return ret;
        }
      }

      return undefined;
    },

    getParent(devId, startDev) {
      if (devId === undefined) return undefined;
      if (startDev === undefined) {
        startDev = this.$store.getters.rootDev;
      }

      if (startDev.children.find(dd => {
          //return parseInt(dd.id) === parseInt(devid);
          //return ((dd.id + "") === (devId + ""));
          return this.stringEqual(dd.id, devId);
        }) !== undefined) {
        return startDev;
      }

      let index = startDev.children.length;
      while (index--) {
        let dev = this.getParent(devId, startDev.children[index]);
        if (dev !== undefined) {
          return dev;
        }
      }

      return undefined;
    },

    getVar(varId, dev) {
      if (varId === undefined) return undefined;
      if (dev === undefined) return undefined;
      if (dev.vars === undefined) return undefined;

      let index = dev.vars.length;
      while (index--) {
        //if (parseInt(dev.vars[index].id) === parseInt(varId)) {
        if (this.intEqual(dev.vars[index].id, varId)) {
          return dev.vars[index];
        }
      }

      return undefined;
    },

    getVarName(devId, varId) {
      if (varId === undefined || devId === undefined) return "";
      let dev = this.getDev(devId);
      if (dev === undefined) return "";

      let varx = this.getVar(varId, dev);
      if (varx === undefined) return "";

      return varx.name;
    },

    /*getDevFullName() {
      let {devId} = this.evt;

      if(devId === undefined) return "";

      console.log(`~~~~~~getDevFullName devId = ${devId}`);
      let {dev, parents} = this.getDevAndPath(devId, undefined);
      console.log(`~~~~~~getDevFullName dev = ${dev.name}`);
      if(dev) {
        let parentName = "";
        parents.forEach(parent => parentName = parentName + '/' + parent.name);
        return parentName.slice(1);
      }
    }*/

    getFullDevName(devid, startDev) {
      let name = "";

      let {parents} = this.getDevAndPath(devid, startDev);

      if(parents !== undefined) {
        let names = parents.map(parent => parent.name);
        name = names.join('/');
      }
      return name;
    },

    copyUndefinedProps(so, ta) {
      Object.keys(so).forEach(key => {
        if (ta[key] === undefined) {
          ta[key] = so[key];
        }
      });
    },

    getAllDevs(startDev, endDevId) {
      if (startDev === undefined) {
        startDev = this.$store.getters.rootDev;
        if (startDev === undefined) {
          return [];
        }
      }
      //if (parseInt(startDev.id) === parseInt(endDevId)) return [];
      //if((startDev.id + "") === (endDevId + "")) {
      if (this.stringEqual(startDev.id, endDevId)) {
        return [];
      }

      let devs = [];
      devs.push(startDev);

      if (startDev.children !== undefined) {
        startDev.children.forEach(dd => {
          let dds = this.getAllDevs(dd, endDevId);
          if (dds !== undefined) {
            dds.forEach(ddx => {
              devs.push(ddx);
            });
          }
        });
      }
      return devs;
    },

    getAllChildren(startDev) {
      //alert("alertDev = " + JSON.stringify(startDev));
      if (startDev === undefined) {
        startDev = this.$store.getters.rootDev;

        if (startDev === undefined) {
          return [];
        }
      }

      let devs = [];
      if (startDev.children !== undefined) {
        startDev.children.forEach(dd => {
          devs.push(dd);

          let dds = this.getAllChildren(dd);
          dds.forEach(ddx => {
            devs.push(ddx);
          });
        });
      }

      //console.log("getAllChildren length : " + devs.length);
      return devs;
    },

    /*getNewDevIds() {
      //alert(count)
      let rootDev = this.$store.getters.rootDev;
      if (rootDev === undefined) return undefined;

      let devs = this.getAllDevs(rootDev);
      let exsitedIds = devs.map(dev => {
        return dev.id;
      });

      let newIds = this.$store.getters.devIdPool.filter(id => {
        let index = exsitedIds.indexOf(id);
        if (index < 0) {
          return true;
        } else {
          exsitedIds.splice(index, 1);
          return false;
        }
      });

      console.log("getNewDevIds done, newIds = " + newIds.join());
      return newIds;
    },*/

    getNewDevIds(count) {
      let {rootDev, site} = this.$store.getters;
      if (rootDev === undefined) return undefined;
      if (count === undefined) count = 10;

      let devs = this.getAllDevs(rootDev);
      let exsitedIds = devs.map(dev => {
        let id = dev.id + "";
        return parseInt(id.split("-")[1]);
      });

      let newIds = [];
      exsitedIds.sort((first, second) => {
        return -(first - second)
      });
      let index = exsitedIds[0];
      while ((count--) > 0) {
        newIds.push(site.id + "-" + (++index));
      }

      console.log("getNewDevIds done, newIds = " + newIds.join());
      return newIds;
    },

    getNewVarIds(devId) {
      let dev = this.getDev(devId);
      if (dev === undefined) return [-1];

      let allVarIds = this.$store.getters.varIdPool.map(id => {
        //return (dev.id*1024 + id);
        return id;
      });
      //console.log("getNewVarIds done. allVarIds = " + allVarIds.join());

      let existedIds = dev.vars.map(vv => {
        return (vv.id);
      });
      //console.log("getNewVarIds done. existedIds = " + existedIds.join());

      let newIds = allVarIds.filter(id => {
        let index = existedIds.indexOf(id);
        if (index < 0) {
          return true;
        } else {
          existedIds.splice(index, 1);
          return false;
        }
      });
      //console.log("getNewVarIds done, newIds = " + newIds.join());
      return newIds;
    },

    isRootDev(dev) {
      return (dev.id === -1)
    },

    trim(str) {
      str = str + "";
      //if(str !== undefined && str !== null) {
      return str.replace(/(^\s+)|(\s+$)/g, '');
      //}
    },

    getVarIdInStr(varx) {
      return `${varx.devId}.${varx.id}`;
    },

    getIdsFromStr(strId) {
      let [devKey, varKey] = strId.split(".");
      return {devKey, varKey};
    },

    getVarNameByFullId(id) {
      let {devKey, varKey} = this.getIdsFromStr(id);
      let dev = this.getDev(devKey);
      if (dev === undefined) return id;

      let vv = this.getVar(varKey, dev);
      if (vv === undefined) return id;

      return `[${dev.name}]${vv.name}`;
    },

    updateVarValue(varData) {
      let {id, devId, value, time} = varData;

      let dev = this.getDev(devId);
      if (dev !== undefined) {
        let varx = this.getVar(id, dev);
        if (varx !== undefined) {
          varx.value = value;
          varx.time = time;
        }
      }
    },

    findFathers(startDev) {
      if (startDev === undefined) return;

      if (startDev.children !== undefined) {
        startDev.children.forEach(child => {
          child.fatherId = startDev.id;
          child.fatherName = startDev.name;
          this.findFathers(child);
        });
      }
    },

    sortDevsByName(devs, childrenIncluded) {
      if (devs === undefined || devs === null) {
        return;
      }
      if (devs.length === 0) {
        return;
      }

      devs.sort((first, second) => {
        if (first.name > second.name)
          return 1;
        if (first.name < second.name)
          return -1;
        return 0;
      });

      if (childrenIncluded) {
        devs.forEach(dev => {
          this.sortDevsByName(dev.children, childrenIncluded);
        });
      }
    },

    sortVarsByImportance(vars) {
      if (vars === undefined) {
        return [];
      }

      let [...retvars] = vars;
      return retvars.sort((first, second) => {
        if (first.chief < second.chief)
          return 1;
        if (first.chief > second.chief)
          return -1;
        else
          return 0;
      });
    },

     getChiefVars(dev, cnt) {
      let [...sortedVars] = this.sortVarsByImportance(dev.vars);
      if (cnt === undefined) {
        cnt = 4;
      }
      return sortedVars.slice(0, cnt);
    },

    stringEqual(str1, str2) {
      return ((str1 + "") === (str2 + ""));
    },

    intEqual(int1, int2) {
      return (parseInt(int1) === parseInt(int2));
    },

    /*refreshDevEvtCount(startDev, evts) {
      if (startDev === undefined) {
        startDev = this.$store.getters.rootDev;

        if (startDev === undefined) {
          return;
        }
      }

      if(evts === undefined) return;

      let devs = this.getAllDevs();
      devs.forEach(dev => dev.evtCount = 0);

      evts.forEach(evt => {
        let {devId} = evt;
        let dev = this.getDev(devId);
        if(dev !== undefined) {
          dev.evtCount = dev.evtCount + 1;
        }
      });
    },

    getChildrenEvtCount(dev) {
      if(dev === undefined || dev.children.length === 0 || dev.evtCount === undefined) return 0;
      let count = 0;
      dev.children.forEach(child => {
        count = count + child.evtCount + this.getChildrenEvtCount(child);
      });

      return count;
    },*/

    getEvts(evts, dev) {
      if(evts === undefined) return [];

      if(dev === undefined) {
        dev = this.$store.getters.rootDev;
      }

      let devIds = this.getAllDevs(dev).map(devx => devx.id);

      let allevts = evts.filter(evt => (devIds.findIndex(id => id === evt.devId) > -1));
      let evtsOfMe = allevts.filter(evt => evt.devId === dev.id);
      let evtsOfChildren = allevts.filter(evt => evt.devId !== dev.id);
      return {evtsOfMe, evtsOfChildren};
    },

    sortDevsByEvt(devs, evts) {
      if (devs === undefined) {
        return [];
      }

      if (evts === undefined || evts.length === 0) {
        return devs;
      }

      let [...retdevs] = devs;

      retdevs.forEach(dev => {
        let {evtsOfMe, evtsOfChildren} = this.getEvts(evts, dev);
        dev.myEvtCnt = evtsOfMe.length;
        dev.myChildrenEvtCnt = evtsOfChildren.length;
      });

      return retdevs.sort((first, second) => {
        if (first.myEvtCnt > second.myEvtCnt) {
          return -1;
        }else if (first.myEvtCnt < second.myEvtCnt){
          return 1;
        }
        else {
          if(first.myChildrenEvtCnt > second.myChildrenEvtCnt) {
            return -1;
          }else if (first.myChildrenEvtCnt < second.myChildrenEvtCnt) {
            return 1;
          }
          return 0;
        }
      });

      /*
      evts.forEach( evt=> {
        let {devId} = evt;
        let dev = retdevs.find(dev => devId === dev.id);
        if(dev !== undefined) {
          dev.evtCnt = dev.evtCnt + 1;
        }
      })

      retdevs.sort((first, second) => {
        if (first.evtCnt < second.evtCnt)
          return 1;
        if (first.evtCnt > second.evtCnt)
          return -1;
        else
          return 0;
      });

      return retdevs;*/
    },

  }
}
