<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";
import { useStore } from "@/store";

import Food from "./components/food.vue";
import Lave from "./components/lave.vue";

const store = useStore();
onMounted(() => {
  if (chrome.storage && location.href.startsWith("chrome")) {
    chrome.storage.onChanged.addListener(async ({ config }) => {
      if (config)
        await store.dispatch("config/setConfig", {
          ...config.newValue,
          $_updata: false,
        });
    });
    chrome.storage.local.get(["config"], ({ config }) => {
      if (config)
        store.dispatch("config/setConfig", { ...config, $_updata: false });
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
    // https://a3510377.github.io/chrome-clock/?foodSchoolName=竹橋國中&laveTitle=會考倒數&laveTime=2022-05-21T00:00:00+08:00
  }
});

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
