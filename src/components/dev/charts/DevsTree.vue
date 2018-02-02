<template>
  <div class="main_content">
    <div id="bedroom"></div>
  </div>
</template>
<script>
  import echarts from 'echarts'
  export default {
    data() {
      return {
        chart: null,
        opinion: ['学习氛围差', '学习氛围一般', '学习氛围很好'],

      }
    },
    methods: {
      draw (id) {
        this.chart = echarts.init(document.getElementById(id));
        this.chart.setOption({
          tooltip: {
            trigger: 'item',
            triggerOn: 'mousemove'
          },
          series:[
            {
              type: 'tree',
              data: [this.$store.getters.rootDev],
              orient: 'vertical',

              left: '2%',
              right: '2%',
              top: '8%',
              bottom: '60%',

              symbolSize: 7,

              label: {
                normal: {
                  position: 'left',
                  verticalAlign: 'middle',
                  align: 'right'
                }
              },

              leaves: {
                label: {
                  normal: {
                    position: 'right',
                    verticalAlign: 'middle',
                    align: 'left'
                  }
                }
              },

              expandAndCollapse: true,

              animationDuration: 550,
              animationDurationUpdate: 750
            }
          ]
        });

      }
    },
    mounted() {
      this.$nextTick(function() {
        this.draw('bedroom')
      })
    }
  }
</script>
<style scoped>
  #bedroom {
    position: relative;
    left: 50%;
    margin-left: -400px;
    margin-bottom: 70px;
    width: 800px;
    height: 600px;
    border: solid rgba(0, 0, 0, 0.11) 1px;
    /*box-shadow: 0 0 8px #FB90B7;
    border-radius: 2px;*/
  }
</style>
