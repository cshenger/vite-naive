<template>
  <h1>第一页</h1>
  <div id="main" style="width:100%; height:400px"></div>
</template>

<script>
import { defineComponent, getCurrentInstance, onMounted } from "vue";

// echarts测试
const option = {
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
    },
  ],
};

export default defineComponent({
  setup() {
    const { appContext } = getCurrentInstance();
    const { $echarts } = appContext.config.globalProperties;

    onMounted(() => {
      let myChart = $echarts.init(document.getElementById("main"));
      option && myChart.setOption(option);
    });
  },
});
</script>

<style>
</style>