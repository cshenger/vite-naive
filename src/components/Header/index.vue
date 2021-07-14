<template>
  <n-layout-header :inverted="inverted" bordered class="header">
    <n-space>
      <n-switch v-model:value="theInverted" @update:value="toggleInverd" /> 主题
    </n-space>
  </n-layout-header>
</template>

<script>
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "Header",
  props: {
    inverted: {
      type: Boolean,
    },
  },
  setup(props, { emit }) {
    let theInverted = ref(props.inverted);

    const toggleInverd = (value) => {
      emit("toggleInverd", value);
    };

    return {
      theInverted,
      toggleInverd,
    };
  },
});
</script>

<style>
</style>