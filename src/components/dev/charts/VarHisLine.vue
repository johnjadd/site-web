<template>
  <div id="chartBox" style="width: 1000px">
    <div id="chart"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  let moment = require('moment');
  //import vintage from './vintage'

  let elmChart = null;
  let chart = null;

  export default {
    props:{
      graphData: undefined,
    },

    data() {
      return {
        screenWidth: document.body.clientWidth,
        screenHeight: document.body.clientHeight,

      }
    },
    watch: {
      screenWidth (val) {
        if (!this.timer) {
          this.screenWidth = val;
          this.timer = true;
          let that = this;
          setTimeout(function () {
            // that.screenWidth = that.$store.state.canvasWidth
            console.log(that.screenWidth);
            that.drawChart(that);
            that.timer = false
          }, 600)
        }
      },
      graphData() {
        console.log(`that = ${JSON.stringify(this.datas)}`);
        this.drawChart(this);
      },
    },
    methods: {
      drawChart (that) {
        //删除该属性能确保echarts重绘
        elmChart.removeAttribute('_echarts_instance_');

        //elmChart.style.width = (window.innerWidth-245) + 'px';
        elmChart.style.width = (that.screenWidth -245) + 'px';
        elmChart.style.width = (that.screenHeight) + 'px';

        chart = echarts.init(elmChart);

        let {dateRange, datas, unit} = that.graphData;
        chart.setOption({
            title : {
              text: '变量历史数据' ,
              subtext: moment(dateRange.date1).format('YYYY年MM月DD日') + ' 至 ' +  moment(dateRange.date2).format('YYYY年MM月DD日'),
            },
            tooltip : {
              trigger: 'axis'
            },
            legend: {
              data: datas.map(data => data.name),
              formatter: function (name) {
                return name;
              }
            },
            toolbox: {
              show : true,
              feature : {
                mark : {show: true},
                dataZoom : {show: true},
                dataView : {show: true},
                //magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
              }
            },
            grid: {
              left: '3%',
              right: '4%',
              bottom: '8%',
              containLabel: true
            },
            calculable : true,
            dataZoom : {
              show : true,
              realtime : true,
              //start : 20,
              //end : 100,
              //filterMode: 'none',
            },
            xAxis : [
              {
                type : 'time',
                //name: '时间',
                min: function(value) {
                  /*console.log(`varhisline date.min = ${(moment(value.min).format('YYYY/MM/DD') + " 00:00:00") }`);
                  return moment(moment(value.min).format('YYYY/MM/DD') + " 00:00:00").format('x');*/
                  return moment(dateRange.date1).format('x');
                },
                max: function(value) {
                  //console.log(`varhisline date.max = ${(moment(value.max).add(1, 'days').format('YYYY/MM/DD') + " 00:00:00") }`);
                  //return moment(moment(value.max).format('YYYY/MM/DD') + " 23:59:59").format('x');
                  return moment(dateRange.date2).add(1, 'days').add(-1, 'second').format('x');
                },
              }
            ],
            yAxis : [
              {
                type : 'value',
                //name: '值',
                axisLabel : {
                  formatter: '{value}' + ' ' +  unit
                }
              }
            ],
            series: that.graphData.datas.map(data => {
              return {
                name: data.name,
                type: 'line',
                data: data.values,
                smooth: true,
                lineStyle: {
                  normal: {
                    width: 3,
                    shadowColor: 'rgba(0,0,0,0.4)',
                    shadowBlur: 10,
                    shadowOffsetY: 10
                  }
                },
                markPoint : {
                  data : [
                    {type : 'max', name: '最大值'},
                    {type : 'min', name: '最小值'}
                  ]
                },

                markLine : {
                  data : [
                    {type : 'average', name: '平均值'}
                  ]
                }
              }
            })
          }
        );
      },

      calScreenSize() {
        window.screenWidth = document.body.clientWidth;
        this.screenWidth = window.screenWidth;
        this.screenHeight = window.screenHeight;
      },
    },
    mounted() {
      elmChart = document.getElementById('chart');

      this.calScreenSize();

      this.$nextTick(function() {
        this.drawChart(this);
      });

      window.onresize = () => {
        return (() => {
          this.calScreenSize();
          //console.log(`window is resizing...`);
        })()
      };
    }
  }
</script>
<style scoped>
  #chart {
    position: relative;

    margin-left: 0 px;
    margin-right: auto;

    margin-bottom: 0px;
    width: 800px;
    height: 600px;
    /*border: solid rgba(0, 0, 0, 0.11) 2px;
    box-shadow: 0 0 8px #FB90B7;
    border-radius: 2px;*/
  }
</style>
