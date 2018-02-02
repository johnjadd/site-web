// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

//import VueMaterial from 'vue-material'
//import 'vue-material/dist/vue-material.css'
//Vue.use(VueMaterial);

import ElementUI from "element-ui"
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(ElementUI);

Vue.use(require('vue-moment'));
const moment = require('moment');
//require('moment/locale/cn');
//初始化moment
moment.locale('zh-cn', {
  months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
  monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
  weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
  weekdaysShort: '周日_周一_周二_周三_周四_周五_周六'.split('_'),
  weekdaysMin: '日_一_二_三_四_五_六'.split('_'),
  longDateFormat: {
    LT: 'Ah点mm分',
    LTS: 'Ah点m分s秒',
    L: 'YYYY-MM-DD',
    LL: 'YYYY年MMMD日',
    LLL: 'YYYY年MMMD日Ah点mm分',
    LLLL: 'YYYY年MMMD日ddddAh点mm分',
    l: 'YYYY-MM-DD',
    ll: 'YYYY年MMMD日',
    lll: 'YYYY年MMMD日Ah点mm分',
    llll: 'YYYY年MMMD日ddddAh点mm分'
  },
  meridiemParse: /凌晨|早上|上午|中午|下午|晚上/,
  meridiemHour: function (hour, meridiem) {
    if (hour === 12) {
      hour = 0;
    }
    if (meridiem === '凌晨' || meridiem === '早上' ||
      meridiem === '上午') {
      return hour;
    } else if (meridiem === '下午' || meridiem === '晚上') {
      return hour + 12;
    } else {
      // '中午'
      return hour >= 11 ? hour : hour + 12;
    }
  },
  meridiem: function (hour, minute, isLower) {
    var hm = hour * 100 + minute;
    if (hm < 600) {
      return '凌晨';
    } else if (hm < 900) {
      return '早上';
    } else if (hm < 1130) {
      return '上午';
    } else if (hm < 1230) {
      return '中午';
    } else if (hm < 1800) {
      return '下午';
    } else {
      return '晚上';
    }
  },
  calendar: {
    sameDay: function () {
      return this.minutes() === 0 ? '[今天]Ah[点整]' : '[今天]LT';
    },
    nextDay: function () {
      return this.minutes() === 0 ? '[明天]Ah[点整]' : '[明天]LT';
    },
    lastDay: function () {
      return this.minutes() === 0 ? '[昨天]Ah[点整]' : '[昨天]LT';
    },
    nextWeek: function () {
      var startOfWeek, prefix;
      startOfWeek = moment().startOf('week');
      prefix = this.unix() - startOfWeek.unix() >= 7 * 24 * 3600 ? '[下]' : '[本]';
      return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
    },
    lastWeek: function () {
      var startOfWeek, prefix;
      startOfWeek = moment().startOf('week');
      prefix = this.unix() < startOfWeek.unix() ? '[上]' : '[本]';
      return this.minutes() === 0 ? prefix + 'dddAh点整' : prefix + 'dddAh点mm';
    },
    sameElse: 'LL'
  },
  ordinalParse: /\d{1,2}(日|月|周)/,
  ordinal: function (number, period) {
    switch (period) {
      case 'd':
      case 'D':
      case 'DDD':
        return number + '日';
      case 'M':
        return number + '月';
      case 'w':
      case 'W':
        return number + '周';
      default:
        return number;
    }
  },
  relativeTime: {
    future: '%s内',
    past: '%s前',
    s: '几秒',
    //s: '%d 秒',
    m: '1 分钟',
    mm: '%d 分钟',
    h: '1 小时',
    hh: '%d 小时',
    d: '1 天',
    dd: '%d 天',
    M: '1 个月',
    MM: '%d 个月',
    y: '1 年',
    yy: '%d 年'
  },
  week: {
    // GB/T 7408-1994《数据元和交换格式·信息交换·日期和时间表示法》与ISO 8601:1988等效
    dow: 1, // Monday is the first day of the week.
    doy: 4  // The week that contains Jan 4th is the first week of the year.
  }
});

import {store} from './store/store'
import App from './App.vue'
import router from './router'
import apis from './mixins/apis';

Vue.config.productionTip = false;

Vue.http.interceptors.push((request, next) => {
  //console.log(`http.interceptors ~~~~~~~~ next = ${next}`);
  let {token} = store.getters;
  if(token) {
    Vue.http.headers.common["Content-Type"] = "application/json; charset=UTF-8";

    if(request.url.indexOf('/auth') > -1) { //如果是登录请求，则删除authorization字段。否则服务程序仍然会判断token
      Vue.http.headers.common["Authorization"] = "";
    }else {
      Vue.http.headers.common["Authorization"] = token;
    }
  }

  next((response) => {//在响应之后传给then之前对response进行修改和逻辑判断。对于token时候已过期的判断，就添加在此处，页面中任何一次http请求都会先调用此处方法
    let {status, body} = response;
    let needSignIn = false;

    //console.log(`http.interceptors ~~~~~~~~response body = ${body}`);
    if(body) {
      let {message, exception} = body;
      if (status === 401) {
        needSignIn = true;
      } else if (status === 500) {
        if (message.indexOf("JWT") > -1 || exception.indexOf("jsonwebtoken") > -1) {
          needSignIn = true;
        }
      }
    }

    if(needSignIn){
      //console.log(`http.interceptors ~~~~~~~~~ goto Signin page`);
      router.push('/signin');
    }else {
      return response;
    }
  });
});

router.beforeEach((to, from, next) => {
  if (to.name === 'signIn') {
    next();
  }

  let {token, user, ipAddr} = store.getters;
  if (!token) {
    token = window.localStorage.getItem('token');
    console.log(`Get token from localStorage, token = ${token}`);
    store.commit('setToken', token);
  }
  console.log(`router.beforeEach token = ${token}, user = ${user}, from = ${from.path}, to = ${to.path}`);

  if (token) {
    if (user === undefined ) {
      apis.methods.getUserInfoFromApi(store).then(res => {
        next();
      }).catch(err => {
        console.log(err);
      })
    } else {
      next();
    }
  } else {
    console.log(`router.beforeEach no token`);
    next({path: 'signIn'});
  }

});


new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {App},
  created() {
    let restfulApiIp = window.location.hostname;
    console.log(`restfulApiIp = ${restfulApiIp}`);
    store.commit('setIpAddr', restfulApiIp);

    /*let {ipAddr} = store.getters;
    if(!ipAddr) {

      apis.methods.getCfgromApi(store).then(res => {
        let {restfulApiIp} = res;
        store.commit('setIpAddr', restfulApiIp);
        console.log(`ipAddr in store is ${store.ipAddr}`);


      });
    }*/
  },
});
