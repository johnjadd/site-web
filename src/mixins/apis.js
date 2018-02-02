import Vue from 'vue'

import VueResource from 'vue-resource' //npm install --save vue-resource
Vue.use(VueResource);

import idMaps from './idMaps'
import utils from './utils'

export default {
  methods: {
    signInFromApi(data, store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      //let {token, ipAddr, port} = state;
      //let url = `http://${ipAddr}:${port}/auth`;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/auth`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}//auth`;
      }

      console.log("Sign in with the user from " + url);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: JSON.stringify(data),
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });
      });
    },

    getUserInfoFromApi(store) {
      let {commit, state, dispatch, getters} = store;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      if(!ipAddr) {ipAddr = window.location.hostname;}

      let url = `http://${ipAddr}:${port}/api/user/whoami`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}/api/user/whoami`;
      }

      //let url = `http://${ipAddr}:${port}/api/user/whoami`;
      console.log(`getUserInfo from ${url} with token ${token}`);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'GET',
          /*headers: {
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": token,
          }*/
        }).then(response => {
          let {message, user} = response.body;
          if(message === "ok") {
            commit('setUser', user);
            resolve("done");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });
      });
    },

    getSiteFromApi(store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      //let {token, ipAddr, port} = state;
      //let url = `http://${ipAddr}:${port}/api/cfg/site`;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/site`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}/api/cfg/site`;
      }

      console.log("Get site data from " + url + " with token: " + token);

      return new Promise(function (resolve, reject) {
        //Vue.http.headers.common["Authorization"] = token;
        //Vue.http.headers.common["Content-Type"] = "application/json; ; charset=UTF-8";
        Vue.http.get(url).then(response => {
          commit('setSite', response.body);

          resolve("done");
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    getDevsFromApi(store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      //let {token, ipAddr, rootDev, port} = state;
      //let url = `http://${ipAddr}:${port}/api/cfg/dev`;

      let {rootDev} = state;
      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/dev`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}/api/cfg/dev`;
      }

      console.log("getDevsFromApi from " + url + "with token: " + token);

      return new Promise(function (resolve, reject) {
        //Vue.http.headers.common["Authorization"] = token;
        //Vue.http.headers.common["Content-Type"] = "application/json; charset=UTF-8";
        Vue.http.get(url).then(response => {
          let devs = response.body;
          utils.methods.sortDevsByName(devs, true);
          commit('setRootDev', devs);
          idMaps.methods.mapDev2Local(rootDev);

          //commit('pushFootPrint', rootDev);
          //commit('setTempDev', rootDev);
          //commit("setFullscreenLoading", false);
          resolve("done");

        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    patchDevFromApi(devData, store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;
      let data = JSON.parse(JSON.stringify(devData));

      let {fatherId} = devData;
      console.log(`~~~~~~~~~~~ patchDevFromApi fatherId = ${fatherId}`);

      idMaps.methods.mapDev2Global(data);

      //let {token, ipAddr, port} = state;
      //let url = `http://${ipAddr}:${port}/api/cfg/dev/${fatherId}`;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/dev/${fatherId}`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}/api/cfg/dev/${fatherId}`;
      }

      console.log(`Patch dev data from ${url} with token: ${token}`);
      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'PATCH',
          body: JSON.stringify(data),
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });
      });
    },

    postDevFromApi(devData, store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let data = JSON.parse(JSON.stringify(devData));
      let {fatherId} = devData;

      idMaps.methods.mapDev2Global(data);

      //let {token, ipAddr, port} = state;
      //let url = `http://${ipAddr}:${port}/api/cfg/dev/${fatherId}`;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/dev/${fatherId}`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}/api/cfg/dev/${fatherId}`;
      }

      console.log(`Post dev data from ${url} with token: ${token}`);
      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: JSON.stringify(data),
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });

      })
    },

    delDevFromApi(devData, store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let data = JSON.parse(JSON.stringify(devData));
      let {fatherId} = devData;

      idMaps.methods.mapDev2Global(data);

      //let {token, ipAddr, port} = state;
      //let url = `http://${ipAddr}:${port}/api/cfg/dev/${fatherId}/${data.id}`;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/dev/${fatherId}/${data.id}`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}/api/cfg/dev/${fatherId}/${data.id}`;
      }

      console.log(`Del dev from ${url} with token: ${token}`);
      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'DELETE',
        }).then(response => {
          let resData = response.bodyText;
          if (resData !== "-1") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });
      });
    },

    patchVarFromApi(varData ,store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let data = JSON.parse(JSON.stringify(varData));

      //console.log(`~~~~~~~~~~~ 1 patchVarFromApi data = ${JSON.stringify(data)}` );
      idMaps.methods.mapVar2Global(data);
      //console.log(`~~~~~~~~~~~ 2 patchVarFromApi data = ${JSON.stringify(data)}` );
      let devId = data.id.devKey;

      //let {token, ipAddr, port} = state;
      //let url = `http://${ipAddr}:${port}/api/cfg/var/${devId}`;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/var/${devId}`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}/api/cfg/var/${devId}`;
      }

      console.log(`Patch var from ${url} with token: ${token}`);
      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'PATCH',
          body: JSON.stringify(data),
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });
      });
    },

    postVarFromApi(varData, store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let data = JSON.parse(JSON.stringify(varData));

      idMaps.methods.mapVar2Global(data);
      let devId = data.id.devKey;

      //let {token, ipAddr, port} = state;
      //let url = `http://${ipAddr}:${port}/api/cfg/var/${devId}`;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/var/${devId}`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}/api/cfg/var/${devId}`;
      }

      console.log(`Post var from ${url} with token: ${token}`);
      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: JSON.stringify(data),
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });
      });
    },

    delVarFromApi(varData, store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let data = JSON.parse(JSON.stringify(varData));

      idMaps.methods.mapVar2Global(data);
      let {devKey, varKey} = data.id;

      //let {token, ipAddr, port} = state;
      //let url = `http://${ipAddr}:${port}/api/cfg/var/${devKey}/${varKey}`;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/var/${devKey}/${varKey}`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${cfg.port}/api/cfg/var/${devKey}/${varKey}`;
      }

      console.log(`Del var from ${url} with token: ${token}`);
      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'DELETE',
        }).then(response => {
          let resData = response.bodyText;
          if (resData !== "-1") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });
      });
    },

    /*getVarValuesByDevFromApi(devData, {commit, state, getters}) {
      let data = JSON.parse(JSON.stringify(devData));

      //let {gDevIdPool} = getters;
      idMaps.methods.mapDev2Global(data);

      let {token, ipAddr, port} = state;
      let url = `http://${ipAddr}:${port}/api/cfg/var/value/bydev/${data.id}`;
      console.log(`getVarValuesByDevFromApi from ${url} with token: ${token}`);

      return new Promise(function (resolve, reject) {
        Vue.http.get(url).then(response => {
          let vars = response.body;
          vars.forEach(varx => {
            idMaps.methods.mapVar2Local(varx);
          });
          resolve(vars);

        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },*/

    /*getVarValuesFromApi(varsData, store) {
      if(!store) return;
      let {commit, state, getters} = store;

      let datas = JSON.parse(JSON.stringify(varsData));

      let varIds = datas.map(data =>{
        idMaps.methods.mapVar2Global(data);
        return data.id;
      });

      let {token, ipAddr, port} = state;
      let url = `http://${ipAddr}:${port}/api/cfg/var/valuetest`;
      console.log(`getVarValuesFromApi from ${url} with token: ${token}`);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: JSON.stringify(varIds),
        }).then(response => {
          let vars = response.body;
          vars.forEach(varx => {
            idMaps.methods.mapVar2Local(varx);
          });
          resolve(vars);

        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },*/

    getVarValuesByDevFromApiTest(devData, {commit, state, getters}) {
      let data = JSON.parse(JSON.stringify(devData));

      //let {gDevIdPool} = getters;
      idMaps.methods.mapDev2Global(data);

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      let url = `http://${ipAddr}:${port}/api/cfg/var/value/bydev/${data.id}`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${real.port}/api/real/var/value/bydev/${data.id}`;
      }

      console.log(`getVarValuesByDevFromApi from ${url} with token: ${token}`);

      return new Promise(function (resolve, reject) {
        Vue.http.get(url).then(response => {
          let dev = response.body;

          dev.vars.forEach(varx => {
            varx.devId = dev.id;
          });
          resolve(dev.vars);
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    getVarValuesFromApiTest(varsData, store) {
      if(!store) return;
      let {commit, state, getters} = store;

      let datas = JSON.parse(JSON.stringify(varsData));

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      let url = `http://${ipAddr}:${port}/api/cfg/var/value`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${real.port}/api/real/var/value`;
      }

      console.log(`getVarValuesFromApi from ${url} with token: ${token}`);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: JSON.stringify(datas),
        }).then(response => {
          let devs = response.body;

          let vars = [];
          devs.forEach(devx => {
            devx.vars.forEach(varx => {
              varx.devId = devx.id;
              vars.push(varx);
            })
          });

          //console.log(`~~~~~~~response.body = ${JSON.stringify(vars)}`);
          resolve(vars);
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    getVarHisFromApi(varData, store, date1, date2) {
      if(!store) return;
      let {commit, state, getters} = store;

      let {id, devId} = varData;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      let url = `http://${ipAddr}:${port}/api/cfg/varhis/${devId}/${id}`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${his.port}/api/cfg/varhis/${devId}/${id}`;
      }

      console.log(`getEvtsFromApi dev data from ${url} with token: ${token}`);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'GET',
          params: { date1, date2},
        }).then(response => {
          let timeValues = response.body;
          resolve(timeValues);
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    getEvtsFromApi(devIds, store) {
      if(!store) return;
      let {commit, state, getters} = store;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/evt/bydev`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${real.port}/api/real/evt/bydev`;
      }

      console.log(`getEvtsFromApi dev data from ${url} with token: ${token}`);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: JSON.stringify(devIds),
        }).then(response => {
          let evts = response.body;
          idMaps.methods.mapEvt2Local(evts);
          /*evts.forEach(evt => {
            evt.devId = idMaps.methods.getLocalDevId(evt.devId);
          });*/
          resolve(evts);
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    getEvtHisFromApi(devIds, store, date1, date2) {
      if(!store) return;
      let {commit, state, getters} = store;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;

      let url = `http://${ipAddr}:${port}/api/cfg/evthis`;
      if(isYunServerWeb === true) {
        let {cfg, his, real} = yunServerNet;
        url = `http://${ipAddr}:${his.port}/api/cfg/evthis`;
      }

      console.log(`getEvtsFromApi dev data from ${url} with token: ${token}`);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          params: { date1, date2},
          body: JSON.stringify(devIds),
        }).then(response => {
          let hisEvts = response.body;
          idMaps.methods.mapEvt2Local(hisEvts);
          resolve(hisEvts);
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    postLoadDevToCacheFromApi(store) {
      if(!store) return;
      let {commit, state, getters} = store;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      if(isYunServerWeb === true) {
        return ;
      }

      let url = `http://${ipAddr}:${port}/api/cfg/dev/reload`;
      console.log(`postLoadDevToCacheFromApi from ${url} with token: ${token}`);
      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: '',
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });

      })
    },

    getNwInfoFromApi(store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      if(isYunServerWeb === true) {
        return ;
      }

      let url = `http://${ipAddr}:${port}/api/cfg/hw/network`;
      console.log("getNwInfoFromApi from " + url + "with token: " + token);

      return new Promise(function (resolve, reject) {
        Vue.http.get(url).then(response => {
          let nws = response.body;
          resolve(nws);
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    postNwInfoToApi(data, store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      if(isYunServerWeb === true) {
        return ;
      }

      let url = `http://${ipAddr}:${port}/api/cfg/hw/network`;
      console.log("postNwInfoToApi from " + url + "with token: " + token);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: JSON.stringify(data),
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    postDnsInfoToApi(data, store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      if(isYunServerWeb === true) {
        return ;
      }

      let url = `http://${ipAddr}:${port}/api/cfg/hw/dns`;
      console.log("postNwInfoToApi from " + url + "with token: " + token);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: JSON.stringify(data),
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    getHwMainInfoFromApi(store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      if(isYunServerWeb === true) {
        return new Promise(function (resolve, reject) {

        });
      }

      let url = `http://${ipAddr}:${port}/api/cfg/hw/`;
      console.log("getHwMainInfoFromApi from " + url + "with token: " + token);

      return new Promise(function (resolve, reject) {
        Vue.http.get(url).then(response => {
          resolve(response.body);
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    getCfgFromApi(store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let url = '../static/cfg.json';
      console.log("getCfgromApi from " + url);

      return new Promise(function (resolve, reject) {
        Vue.http.get(url).then(response => {
          resolve(response.body);
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });

    },

    postNwRebootToApi(store) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let {token, ipAddr, port, isYunServerWeb, yunServerNet} = state;
      if(isYunServerWeb === true) {
        return ;
      }

      let url = `http://${ipAddr}:${port}/api/cfg/hw/reboot`;
      console.log("postNwInfoToApi from " + url + "with token: " + token);

      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: '',
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        })
      });
    },

    uploadDevToYunServerFromApi(devData, store, serverIp, serverPort) {
      if(!store) return;
      let {commit, state, dispatch, getters} = store;

      let {ipAddr, port, isYunServerWeb, yunServerNet} = state;
      if(isYunServerWeb === true) {
        return ;
      }

      let data = JSON.parse(JSON.stringify(devData));
      let {fatherId} = devData;

      idMaps.methods.mapDev2Global(data);

      let {token, site} = state;

      let url = `http://${serverIp}:${serverPort}/api/cfg/dev/uploadToServer/${site.id}`;
      console.log(`Post dev data to yun server ${url} with token: ${token}`);
      return new Promise(function (resolve, reject) {
        Vue.http({
          url: url,
          method: 'POST',
          body: JSON.stringify(data),
        }).then(response => {
          let resData = response.body;
          if (resData !== "") {
            resolve(resData);
          } else {
            resolve("failed");
          }
        }, error => {
          console.log(error);
          resolve("failed");
        });

      })
    },

  }
}
