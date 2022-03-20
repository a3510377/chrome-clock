<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import { useStore } from "@/store";

import Food from "./components/food.vue";
import Lave from "./components/lave.vue";

const store = useStore();

if (chrome.storage && location.href.indexOf("chrome")) {
  chrome.storage.onChanged.addListener((changes) => {
    const { config } = changes;
    if (config)
      store.commit("config/setConfig", { ...config, $_updata: false });
  });
  chrome.storage.local.get(["config"], (result) => {
    if (result.config === void 0)
      chrome.storage.local.set({ config: { a: "b" } });
  });
} else {
  let data = new URL(location.href).searchParams;

  store.commit("config/setConfig", {
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
