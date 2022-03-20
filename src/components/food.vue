<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";
import axios from "axios";
import { mealDataType, menuType } from "@/@types/food";

onBeforeUnmount(() => clearInterval(timeLoop));

// https://fatraceschool.k12ea.gov.tw/school?SchoolName=%E7%AB%B9%E6%A9%8B
const allDish = ref<menuType["data"]>();

const func = async () => {
  let date = new Date();
  const { data } = await axios({
    url: `https://fatraceschool.k12ea.gov.tw/offered/meal?SchoolId=64736396&period=${[
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate() + 1,
    ].join("-")}&KitchenId=all`,
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
  <div class="menu" v-if="allDish">
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
</template>

<style lang="scss">
.menu {
  position: fixed;
  top: 72.5%;
  left: 70%;
  right: 0;
  bottom: 0;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(4, calc(100% / 4));
  height: 10vh;
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
    left: 60%;
  }
  @media all and (max-width: 1080px) {
    left: 50%;
    .dish {
      font-size: 1.5vw;
    }
  }
  @media all and (max-width: 680px) {
    left: 25%;
  }
  @media all and (max-width: 480px) {
    left: 0;
  }
  @media all and (max-width: 380px), (max-height: 730px) {
    display: none;
  }
}
</style>
