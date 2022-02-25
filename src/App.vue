<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

import Time from "./components/time.vue";
import Covid from "./components/covid.vue";
import Lave from "./components/lave.vue";

const centerType = ref<boolean>();
setInterval(() => (centerType.value = !centerType.value), 1e3 * 30);

onBeforeUnmount(() => {});
</script>

<template>
  <div class="wrapper">
    <component :is="centerType ? Time : Lave"></component>
    <!-- <Covid /> -->
  </div>
</template>

<style lang="scss">
@import url(@/assets/scss/main.scss);
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  > .wrapper {
    flex-grow: 1;
    width: 100%;
  }
}
</style>
