<template>
  <div class="container">
    <n-layout position="absolute">
      <Header class="header" :inverted="inverted" @toggleInverd="toggleInverd" />
      <n-layout has-sider position="absolute" class="content">
        <Sidebar :inverted="inverted" />
        <n-layout content-style="padding: 24px;">
          <Breadcrumb />
          <n-message-provider>
            <router-view></router-view>
          </n-message-provider>
        </n-layout>
      </n-layout>
    </n-layout>
  </div>
</template>

<script>
import { defineComponent, ref } from "vue";
import Sidebar from "../components/Sider/index.vue";
import Header from "../components/Header/index.vue";
import Breadcrumb from "./Breadcrumb/index.vue";

export default defineComponent({
  name: "App",
  components: { Sidebar, Header, Breadcrumb },
  setup() {
    let inverted = ref(false);

    const toggleInverd = (value) => {
      inverted.value = value;
    };

    return {
      inverted,
      toggleInverd,
    };
  },
});
</script>

<style lang="scss">
.container {
  position: relative;
  height: 100vh;
  .header {
    height: 60px;
  }
  .content {
    min-height: calc(100vh - 56px);
    top: 56px;
    bottom: 56px;
  }
}
</style>