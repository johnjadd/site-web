<template>
  <el-form ref="theForm" v-model="param" label-width="80px" :model="param" :rules="rules" status-icon>
    <el-form-item label="网口">
      <el-input v-model="param.name" disabled></el-input>
    </el-form-item>

    <el-form-item label="分配方式">
      <el-select v-model="param.dhcp"
                 size="large">
        <el-option
          v-for="item in DhcpOpts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
    </el-form-item>

    <el-form-item label="IP地址" prop="ip">
      <el-input v-model="param.ip"></el-input>
    </el-form-item>

    <el-form-item label="子网掩码" prop="mask">
      <el-input v-model="param.mask"></el-input>
    </el-form-item>

    <el-form-item label="网关" prop="gateway">
      <el-input v-model="param.gateway"></el-input>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('theForm')">确定</el-button>
      <el-button @click="cancelForm('theForm')">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
  import {mapGetters} from 'vuex'
  //import {validationMixin} from 'vuelidate'
  //import {required, ipAddress, between} from 'vuelidate/lib/validators'

  export default {
    computed: {
      ...mapGetters({
        tempData: 'tempData'
      })
    },

    //只有在created后才能起作用，第一次创建时时不起作用的
    watch: {
      tempData() {
        this.init();
      }
    },

    created() {
      this.init();
    },

    mixins: [
    ],

    data() {
      let checkIp = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'));
        }

        if (!this.verifyIp(value)) {
          return callback(new Error('地址格式错误'));
        }

        if(this.param.gw !== ""){
          this.$refs.theForm.validateField('gateway');
        }

        callback();
      };

      let checkMask = (rule, value, callback) => {
        if (!this.verifyIp(value)) {
          return callback(new Error('地址格式错误'));
        }

        if(this.param.gw !== ""){
          this.$refs.theForm.validateField('gateway');
        }

        callback();
      };

      let checkGw = (rule, value, callback) => {
        if(value === "") {
           callback();
        }

        if (!this.verifyIp(value)) {
          return callback(new Error('地址格式错误'));
        }

        if(!this.isEqualIPAddress(this.param.ip, this.param.gateway, this.param.mask)){
          return callback(new Error('网关与网址必须在同一个网段'));
        }

        callback();
      };

      return {
        param: {
          ip: '',
        },

        DhcpOpts: [
          {value: true, label: 'DHCP自动分配'},
          {value: false, label: '静态手工分配'},
        ],

        rules: {
          ip: [
            {validator: checkIp, trigger: 'blur'},
          ],
          mask: [
            {validator: checkMask, trigger: 'blur'},
          ],
          gateway: [
            {validator: checkGw, trigger: 'blur'}

          ],
        }
      }
    },

    methods: {
      init() {
        this.param = this.tempData;
      },

      verifyIp(ip) {
        //return /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/.test(ip || "");
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
          .test(ip || "");
      },

      isEqualIPAddress(addr1, addr2, mask) {
        if (!addr1 || !addr2 || !mask) {
          console.log("各参数不能为空");
          return false;
        }

        let res1 = [];
        let res2 = [];

        addr1 = addr1.split(".");
        addr2 = addr2.split(".");
        mask = mask.split(".");

        for (let i = 0, ilen = addr1.length; i < ilen; i += 1) {
          res1.push(parseInt(addr1[i]) & parseInt(mask[i]));
          res2.push(parseInt(addr2[i]) & parseInt(mask[i]));
        }
        if (res1.join(".") === res2.join(".")) {
          console.log("在同一个网段");
          return true;
        } else {
          console.log("不在同一个网段");
          return false;
        }
      },

      submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.$emit('submit');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      cancelForm(formName) {
        //this.$refs[formName].resetFields();
        this.$emit('cancel');
      }
    }

  }

</script>

<style scoped>

</style>
