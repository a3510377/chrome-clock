<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

const time = ref<string>();

const func = () => {
  let nowTime = new Date();
  time.value = (~~(
    +new Date(+new Date(nowTime.getUTCFullYear(), 4, 21) - +nowTime) /
    (1e3 * 60 * 60 * 24)
  )).toString();
};
func();

const loop = setInterval(func, 5e2);

onBeforeUnmount(() => {
  clearInterval(loop);
});
</script>

<template>
  <div class="lave flex flex-center flex-item-center">
    會考剩餘倒數
    <span v-for="text in time" :key="text" v-text="text"></span>
    天
  </div>
</template>

<style lang="scss" scoped>
.lave {
  width: 100%;
  height: 100%;
  font-size: 4em;
  font-family: "Bungee Outline", "Shizuru", cursive;
}
</style>
