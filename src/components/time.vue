<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

const time = ref<{
  year: string | number;
  month: string | number;
  date: string | number;
}>();

const func = () => {
  let nowTime = new Date();
  time.value = {
    year: nowTime.getFullYear(),
    month: nowTime.getMonth() + 1,
    date: nowTime.getDate(),
  };
  console.log(time.value);
};
func();
const loop = setInterval(func, 5e2);

onBeforeUnmount(() => {
  clearInterval(loop);
});
</script>

<template>
  <div class="clock flex flex-center flex-item-center">
    <div
      :class="key"
      :key="index"
      v-for="([key, value], index) in Object.entries(time || {})"
    >
      <span v-for="text in `${value}`" :key="text" v-text="text" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.delay {
  width: 100%;
  height: 100%;
  font-size: 4em;
  font-family: "Bungee Outline", "Shizuru", cursive;
}
</style>
