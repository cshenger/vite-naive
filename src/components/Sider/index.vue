<template>
  <n-layout-sider class="height" bordered show-trigger collapse-mode="width" :collapsed-width="64" :width="240" :native-scrollbar="false" :inverted="inverted">
    <n-menu :inverted="inverted" :collapsed-width="64" :collapsed-icon-size="22" @update:value="handleUpdateValue" :options="navs" :value="active" />
  </n-layout-sider>
</template>

<script>
import { defineComponent, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import routes from "@/router/routes";
import { deepClone } from "@/utils/index";

function filterNavs(ary) {
  ary.forEach((item, index) => {
    if (item.children) {
      filterNavs(item.children);
    } else {
      if (item.hidden) {
        ary.splice(index, 1);
      }
    }
  });

  return ary;
}

export default defineComponent({
  name: "Sidebar",
  props: {
    inverted: {
      type: Boolean,
    },
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const navs = filterNavs(deepClone(routes));
    let active = ref("");

    const handleUpdateValue = (key, item) => {
      active.value = key;
      router.push({ path: item.path });
    };

    watch(
      () => route.path,
      () => {
        if (!route.children) {
          active.value = route.name;
        }
      },
      { immediate: true, deep: true }
    );

    return {
      navs,
      active,
      handleUpdateValue,
    };
  },
});
</script>

<style>
</style>