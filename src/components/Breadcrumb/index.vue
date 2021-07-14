<template>
  <n-breadcrumb>
    <n-breadcrumb-item v-for="item in matched" :key="item.key">{{item.meta.label}}</n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useRoute } from "vue-router";

export default defineComponent({
  name: "Breadcrumb",
  setup() {
    const route = useRoute();
    const matched = ref([]);

    watch(
      () => route.path,
      () => {
        matched.value = route.matched.filter((item) => {
          return !!item.meta.label;
        });
      },
      { deep: true, immediate: true }
    );

    return {
      matched,
    };
  },
});
</script>

<style>
</style>