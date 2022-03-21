<script setup lang="ts">
import { ref, onBeforeUnmount, computed, watch } from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { mealDataType, menuType } from "@/@types/food";

const store = useStore();

const schoolId = computed(() => store.state.config.food.schoolId);
const allDish = ref<menuType["data"]>();

watch(schoolId, () => func());
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
const show = ref<boolean>();
</script>

<template>
  <div v-if="allDish">
    <transition>
      <div class="menu" v-if="show">
        <div class="dish" v-for="(dish, index) in allDish" :key="index">
          <div class="cover">
            <img
              :src="`https://fatraceschool.k12ea.gov.tw/dish/pic/${dish.DishId}`"
              alt="菜色圖片"
            />
          </div>
          <div class="info flex flex-down flex-item-center">
            <span v-text="dish.DishType" />
            <span v-text="dish.DishName" />
          </div>
        </div>
      </div>
    </transition>
    <button @click="show = !show">test</button>
  </div>
</template>

<style lang="scss">
.menu {
  position: fixed;
  top: 72.5%;
  right: 0;
  bottom: 0;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(4, calc(100% / 4));
  height: 10vh;
  width: 30%;
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
@keyframes comeIn {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

@keyframes comeOut {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(100%);
  }
}

.v-enter-active {
  animation: comeIn 1s;
  transition: opacity 1s ease-out;
}

.v-leave-active {
  animation: comeOut 1s;
  transition: opacity 1s ease-out;
}
</style>
