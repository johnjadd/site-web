
export default {
  methods: {
    goVarInfo(devId, varId) {
      console.log(`~~~~~~~~~~~ goVarInfo var id = ${devId}.${varId}`);
      this.$router.push({name: 'var_info', params: {devId, varId}});
    },

    goDev(devId) {
      console.log(`~~~~~~~~~~~ goDev id = ${devId}`);
      this.$router.push({name: 'dev', params: {devId}});
    },

    goVar(devId) {
      console.log(`~~~~~~~~~~~ goVar devId = ${devId}`);
      this.$router.push({name: 'var', params: {devId}});
    },

    goVarHis(devId, varId) {
      console.log(`~~~~~~~~~~~ goVarHis devId = ${devId}, varId = ${varId}`);
      this.$router.push({name: 'var_his', params: {devId, varId}});
    },

    goEvtHis(devId) {
      console.log(`~~~~~~~~~~~ goEvtHis devId = ${devId}`);
      this.$router.push({name: 'evt_his', params: {devId}});
    },

    goCurrentEvt(devId) {
      console.log(`~~~~~~~~~~~ goCurrentEvt`);
      this.$router.push({name: 'evt', params: {devId}});
    },

    goDevCfg(devId) {
      console.log(`~~~~~~~~~~~ goDevCfg id = ${devId}`);
      this.$router.push({name: 'cfg_dev', params: {devId}});
    },

    goVarCfg(devId) {
      console.log(`~~~~~~~~~~~ goVarCfg devId = ${devId}`);
      this.$router.push({name: 'cfg_var', params: {devId}});
    },

    goBack() {
      console.log(`~~~~~~~~~~~ goBack`);
      this.$router.back();
    },
  }
}
