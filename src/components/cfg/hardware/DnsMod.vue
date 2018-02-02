<template>
  <el-form ref="theForm" label-width="100px" :model="formData" status-icon>

    <el-form-item
      v-for="(dns, index) in formData.param"
      :label="'DNS' + index"
      :key="index"
      :prop="'param.' + index + '.value'"
      :rules="{validator: checkDns, trigger: 'blur'}"
    >
      <el-col :span="20"><el-input v-model="dns.value"></el-input></el-col>
      <el-col :span="4"><el-button size="mini" type="text" style="margin-left: 10px" @click.prevent="removeDns(dns)">删除</el-button></el-col>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm('theForm')">确定</el-button>
      <el-button @click="addDns">新增域名</el-button>
      <el-button @click="cancelForm('theForm')">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script>
  import {mapGetters} from 'vuex'

  export default {
    components: {
    },
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
      return {
        formData: {
          param: [],
        },
      }
    },

    methods: {
      init() {
        this.formData.param = this.tempData;
      },

      verifyIp(ip) {
        //return /^(([1-9]?\d|1\d\d|2[0-4]\d|25[0-5])(\.(?!$)|(?=$))){4}$/.test(ip || "");
        return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/
          .test(ip || "");
      },

      checkDns(rule, value, callback) {
        if (!value) {
          return callback(new Error('不能为空'));
        }

        if (!this.verifyIp(value)) {
          return callback(new Error('地址格式错误'));
        }

        callback();
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
      },

      removeDns(item) {
        console.log(`this.formData.param = ${this.formData.param}`);
        let index = this.formData.param.indexOf(item);
        if (index !== -1) {
          this.formData.param.splice(index, 1);
        }
      },

      addDns() {
        this.formData.param.push({
          value: ''
        });
      }
    }

  }

</script>

<style scoped>

</style>
