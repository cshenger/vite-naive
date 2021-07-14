<template>
  <div>
    <h1>第二页</h1>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
    <p>test</p>
  </div>
</template>

<script>
import { defineComponent, getCurrentInstance } from "vue";

export default defineComponent({
  setup() {
    const { appContext } = getCurrentInstance();
    const { $http, $echarts } = appContext.config.globalProperties;

    $http({ url: "/test" });
  },
});
</script>

<style>
</style>