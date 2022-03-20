<script setup lang="ts">
import { onBeforeUnmount } from "vue";
import { useStore } from "@/store";

import Food from "./components/food.vue";
import Lave from "./components/lave.vue";

const store = useStore();

if (chrome.storage && location.href.indexOf("chrome")) {
  chrome.storage.onChanged.addListener(async (changes) => {
    const { config } = changes;
    if (config)
      await store.dispatch("config/setConfig", { ...config, $_updata: false });
  });
  chrome.storage.local.get(["config"], (result) => {
    if (result.config)
      store.dispatch("config/setConfig", { ...result.config, $_updata: false });
  });
} else {
  let data = new URL(location.href).searchParams;

  store.dispatch("config/setConfig", {
    lave: { title: data.get("laveTitle"), laveTime: data.get("laveTime") },
    food: {
      schoolId: data.get("foodSchoolId"),
      schoolName: data.get("foodSchoolName"),
    },
    $_updata: false,
  });
}

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
