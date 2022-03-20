<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

import Food from "./components/food.vue";
import Lave from "./components/lave.vue";
Object.assign(window, { a: chrome, b: chrome.contextMenus });
// const centerType = ref<boolean>();
// setInterval(() => (centerType.value = !centerType.value), 1e3 * 30);

onBeforeUnmount(() => {});
</script>

<template>
  <div class="wrapper">
    <Lave />
    <Food />
  </div>
</template>

<style lang="scss">
@import url(@/assets/scss/main.scss);
#app {
  background-color: #1e1e1e;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  > .wrapper {
    position: relative;
    flex-grow: 1;
    width: 100%;
  }
}
</style>
