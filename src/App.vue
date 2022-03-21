<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useStore } from "@/store";

import Food from "./components/food.vue";
import Lave from "./components/lave.vue";
import Config from "./components/config.vue";

const store = useStore();
onMounted(() => {
  if (chrome?.storage && location.href.startsWith("chrome")) {
    chrome.storage.onChanged.addListener(async ({ config }) => {
      if (config)
        await store.dispatch("config/setConfig", {
          ...config.newValue,
          $_updata: false,
        });
    });
    chrome.storage.local.get("config", ({ config }) => {
      if (config)
        store.dispatch("config/setConfig", { ...config, $_updata: false });
    });
  } else {
    let data = new URL(location.href).searchParams;
    if (
      Object.keys(data).filter((_) =>
        ["endTitle", "endTime", "foodSchoolId", "foodSchoolName"].includes(_)
      )
    )
      store.dispatch("config/setConfig", {
        lave: { title: data.get("endTitle"), laveTime: data.get("endTime") },
        food: {
          schoolId: data.get("foodSchoolId"),
          schoolName: data.get("foodSchoolName"),
        },
        $_updata: false,
      });
    else
      store.dispatch("config/setConfig", {
        ...JSON.parse(localStorage.getItem("config") || "{}"),
        $_updata: false,
      });
  }
});

onBeforeUnmount(() => {});
</script>

<template>
  <div class="wrapper">
    <Lave />
    <Food />
    <Config />
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
