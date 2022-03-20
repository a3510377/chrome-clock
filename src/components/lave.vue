<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";

const time = ref<string[]>();
let countDownDate = new Date("2022-05-21T00:00:00+08:00").getTime();
const timeFormat = ["天", "小時", "分鐘", "秒"];
const func = () => {
  let nowTime = new Date().getTime();
  let distance = countDownDate - nowTime;
  time.value = [
    distance / (1e3 * 60 * 60 * 24),
    (distance % (1e3 * 60 * 60 * 24)) / (1e3 * 60 * 60),
    (distance % (1e3 * 60 * 60)) / (1e3 * 60),
    (distance % (1e3 * 60)) / 1e3,
  ].map((d) => (~~d).toString().padStart(2, "0"));
};
func();

const loop = setInterval(func, 1e2);

onBeforeUnmount(() => {
  clearInterval(loop);
});
</script>

<template>
  <div class="lave flex flex-item-center flex-center flex-down">
    <div class="title">會考剩餘倒數</div>
    <div class="flex">
      <div class="flex" v-for="(txt, index) in timeFormat" :key="index">
        <span class="time" v-text="time?.[index]" /><span v-text="txt" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lave {
  .title {
    font-size: 5vw;
    font-family: sans-serif;
  }
  .time {
    width: 9vw;
    text-align: center;
    font-weight: 600;
  }
  font-size: 6vw;
  width: 100%;
  height: 100%;
  font-family: "Bungee Outline", "Shizuru", cursive;
}
</style>
