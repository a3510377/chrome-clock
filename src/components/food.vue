<script setup lang="ts">
import { ref, onBeforeUnmount, computed, watch } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { mealDataType, menuType } from "@/@types/food";

const store = useStore();

const schoolId = computed(() => store.state.config.food.schoolId);
const _show = computed(() => store.state.config.food.open);
const allDish = ref<menuType["data"]>();
const show = ref<boolean>(false);

watch(schoolId, () => func());
watch(_show, () => (show.value = !!_show.value));
watch(show, () => (store.state.config.food.open = show.value));

onBeforeUnmount(() => clearInterval(timeLoop));

const func = async () => {
  let date = new Date();
  const { data } = await axios({
    url: `https://fatraceschool.k12ea.gov.tw/offered/meal?SchoolId=${
      schoolId.value
    }&period=${[date.getFullYear(), date.getMonth() + 1, date.getDate()].join(
      "-"
    )}&KitchenId=all`,
    method: "GET",
  });
  let menu = (<mealDataType>data)?.data?.[0];
  if (menu) {
    const { data } = await axios({
      url: `https://fatraceschool.k12ea.gov.tw/dish?BatchDataId=${menu.BatchDataId}`,
      method: "GET",
    });
    allDish.value = (<menuType>data)?.data;
  }
};
const timeLoop = setInterval(func, 1e3 * 60 * 10);

func();
</script>

<template>
  <div v-if="allDish" class="menu">
    <transition name="content">
      <div class="content" v-show="show">
        <div class="dish" v-for="(dish, index) in allDish" :key="index">
          <div class="cover">
            <img
              :src="`https://fatraceschool.k12ea.gov.tw/dish/pic/${dish.DishId}`"
              alt="菜色圖片"
            />
          </div>
          <div class="flex flex-down flex-item-center">
            <span v-text="dish.DishType" />
            <span v-text="dish.DishName" />
          </div>
        </div>
      </div>
    </transition>
    <div class="type" @click="show = !show">
      <svg
        v-if="show"
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#fff"
      >
        <path
          d="M0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0zm0 0h24v24H0V0z"
          fill="none"
        />
        <path
          d="M12 6c3.79 0 7.17 2.13 8.82 5.5-.59 1.22-1.42 2.27-2.41 3.12l1.41 1.41c1.39-1.23 2.49-2.77 3.18-4.53C21.27 7.11 17 4 12 4c-1.27 0-2.49.2-3.64.57l1.65 1.65C10.66 6.09 11.32 6 12 6zm-1.07 1.14L13 9.21c.57.25 1.03.71 1.28 1.28l2.07 2.07c.08-.34.14-.7.14-1.07C16.5 9.01 14.48 7 12 7c-.37 0-.72.05-1.07.14zM2.01 3.87l2.68 2.68C3.06 7.83 1.77 9.53 1 11.5 2.73 15.89 7 19 12 19c1.52 0 2.98-.29 4.32-.82l3.42 3.42 1.41-1.41L3.42 2.45 2.01 3.87zm7.5 7.5l2.61 2.61c-.04.01-.08.02-.12.02-1.38 0-2.5-1.12-2.5-2.5 0-.05.01-.08.01-.13zm-3.4-3.4l1.75 1.75c-.23.55-.36 1.15-.36 1.78 0 2.48 2.02 4.5 4.5 4.5.63 0 1.23-.13 1.77-.36l.98.98c-.88.24-1.8.38-2.75.38-3.79 0-7.17-2.13-8.82-5.5.7-1.43 1.72-2.61 2.93-3.53z"
        /></svg
      ><svg
        v-else
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#fff"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  top: 72.5%;
  right: 0;
  width: 30%;
  bottom: 0;
  overflow: hidden;
  position: absolute;
  @keyframes show {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(100%);
    }
  }
  .type {
    right: 1em;
    bottom: 1em;
    cursor: pointer;
    position: absolute;
  }
  .content {
    display: grid;
    align-items: center;
    grid-template-columns: repeat(4, calc(100% / 4));
    .dish {
      height: 100%;
      padding: 5px;
      display: flex;
      align-items: center;
      flex-direction: column;
      .cover {
        height: calc(15vh / 2);
        width: 100%;
        img {
          width: 100%;
          max-width: 100%;
          height: 100%;
          display: block;
          border: none;
          object-fit: cover;
          border-radius: 10px;
        }
      }
    }

    /*  */
    &.content-leave-active,
    &.content-enter-active {
      transition: all 0.9s ease;
    }
    &.content-enter-from {
      transform: translateX(100%);
    }
    &.content-leave-to {
      transform: translateX(100%);
    }
  }
  @media all and (max-width: 1380px) {
    width: 40%;
  }
  @media all and (max-width: 1080px) {
    width: 50%;
    .dish {
      font-size: 1.5vw;
    }
  }
  @media all and (max-width: 680px) {
    width: 75%;
  }
  @media all and (max-width: 480px) {
    width: 100%;
  }
  @media all and (max-width: 380px), (max-height: 730px) {
    display: none;
  }
}
</style>
