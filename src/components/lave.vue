<script setup lang="ts">
import { onBeforeUnmount, computed, watch, ref } from "vue";
import { useStore } from "@/store";

const store = useStore();
const countDownDateComp = computed(() => store.state.config.lave.laveTime);

watch(countDownDateComp, (data) => data && (countDownDate.value = data));

const title = computed(() => store.state.config.lave.title || "會考剩餘");

const countDownDate = ref<Date | string>("2022-05-21T00:00:00+08:00");
const time = ref<string[]>();

const timeFormat = ["天", "小時", "分鐘", "秒"];
const func = () => {
  let distance = new Date(countDownDate.value).getTime() - new Date().getTime();

  time.value = [
    distance / (1e3 * 60 * 60 * 24),
    (distance % (1e3 * 60 * 60 * 24)) / (1e3 * 60 * 60),
    (distance % (1e3 * 60 * 60)) / (1e3 * 60),
    (distance % (1e3 * 60)) / 1e3,
  ].map((d) => (~~d).toString().padStart(2, "0"));
  let data = time.value
    .map((d, index) => [index, +d])
    .filter(([, d]) => !(d === 0))[0];
  document.title = `${title.value} ${+data[1] + 1 || ""}${timeFormat[data[0]]}`;
};
func();

const loop = setInterval(func, 1e2);

onBeforeUnmount(() => clearInterval(loop));
</script>

<template>
  <div class="lave flex flex-item-center flex-center flex-down">
    <div class="title" v-text="title" />
    <div class="flex">
      <div class="flex" v-for="(txt, index) in timeFormat" :key="index">
        <span class="time" v-text="time?.[index]" /><span v-text="txt" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.lave {
  > div {
    margin: 10px 0;
  }
  .title {
    font-size: 5vw;
  }
  .time {
    width: 9vw;
    text-align: center;
    font-weight: 100;
  }
  font-size: 6vw;
  width: 100%;
  height: 100%;
  font-family: "openhuninn", serif;
  font-weight: 400;
}
</style>
