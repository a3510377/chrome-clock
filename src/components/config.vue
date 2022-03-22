import { findSchool } from "@/@types/food";
<script setup lang="ts">
import {
  ref,
  reactive,
  onBeforeUnmount,
  onMounted,
  computed,
  watch,
} from "vue";
import axios from "axios";

import { useStore } from "@/store";
import { AllStateTypes } from "@/store/types";
import { findSchool } from "@/@types/food";

const store = useStore();

const show = ref<boolean>(false);
const schoolName = ref<string>("");
const schoolConfigEl = ref<HTMLInputElement>();
const isChromePlugin: boolean = !!chrome?.storage;

const configState = computed(() => store.state.config);
let config = reactive<AllStateTypes["config"]>({ lave: {}, food: {} });
let schools = reactive<findSchool>({ data: [], result: 1 });

watch(configState, () => (config = configState.value));
watch(config, () =>
  store.dispatch("config/setConfig", { ...config, $_updata: true })
);

/*  */
onMounted(() => {
  axios({
    method: "GET",
    url: "https://fatraceschool.k12ea.gov.tw/school",
  })
    .then(({ data }) => (schools.data = data.data))
    .catch();
});

let nowSchool: HTMLLIElement | null;
const schoolsShow = ref<boolean>();
const mouseEvent = ($event: MouseEvent) => {
  nowSchool?.classList.remove("highlighted");
  nowSchool = <HTMLLIElement | null>$event.target;
  nowSchool?.classList.add("highlighted");
};
const setSchool = ($event: MouseEvent) => {
  const data = (<HTMLLIElement | null>$event.target)?.dataset;
  if (!data) return;
  config.food.schoolId = data.schoolId;
  config.food.schoolName = data.schoolName;
  schoolName.value = <string>data.schoolName;
};

const checkInSchoolConfigFunc = (event: MouseEvent) => {
  if (
    event.target &&
    !(event.target == schoolConfigEl.value) &&
    !schoolConfigEl.value?.contains(<Node>event.target)
  )
    schoolsShow.value = false;
};
addEventListener("click", checkInSchoolConfigFunc);
onBeforeUnmount(() => removeEventListener("click", checkInSchoolConfigFunc));
</script>

<template>
  <div v-if="!isChromePlugin" class="config">
    <div class="content" v-if="show">
      <div class="input">
        <label for="setTitle">倒計時標題:</label>
        <input
          autocomplete="off"
          type="text"
          placeholder="會考剩餘"
          v-model="config.lave.title"
          id="setTitle"
        />
      </div>
      <div class="input">
        <label for="setDate">設定到期時間:</label>
        <!-- value="2022-05-21T00:00" -->

        <input
          autocomplete="off"
          type="datetime-local"
          v-model="config.lave.laveTime"
          id="setDate"
        />
      </div>
      <div class="input setSchool" @blur="schoolsShow = false">
        <label for="schoolName">請輸入學校名:(可選)</label>
        <input
          ref="schoolConfigEl"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          type="search"
          placeholder="請輸入學校名 / id / code"
          v-model="schoolName"
          id="schoolName"
          @keydown.esc="schoolsShow = false"
          @focus="schoolsShow = true"
        />
        <ul class="schools" v-show="schoolsShow">
          <li
            v-for="(school, index) in schools.data"
            v-text="school.SchoolName"
            :key="index"
            :data-school-id="school.SchoolId"
            :data-school-code="school.SchoolCode"
            :data-school-name="school.SchoolName"
            @mouseover="mouseEvent"
            @click="[setSchool($event), (schoolsShow = !schoolsShow)]"
            v-show="
              `${school.SchoolName},${school.SchoolCode},${school.SchoolId}`.includes(
                schoolName
              )
            "
          />
        </ul>
      </div>
    </div>
    <div class="icon" @click="show = !show">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 0 24 24"
        width="24px"
        fill="#fff"
      >
        <path d="M0 0h24v24H0V0z" fill="none" />
        <path
          d="M19.43 12.98c.04-.32.07-.64.07-.98 0-.34-.03-.66-.07-.98l2.11-1.65c.19-.15.24-.42.12-.64l-2-3.46c-.09-.16-.26-.25-.44-.25-.06 0-.12.01-.17.03l-2.49 1c-.52-.4-1.08-.73-1.69-.98l-.38-2.65C14.46 2.18 14.25 2 14 2h-4c-.25 0-.46.18-.49.42l-.38 2.65c-.61.25-1.17.59-1.69.98l-2.49-1c-.06-.02-.12-.03-.18-.03-.17 0-.34.09-.43.25l-2 3.46c-.13.22-.07.49.12.64l2.11 1.65c-.04.32-.07.65-.07.98 0 .33.03.66.07.98l-2.11 1.65c-.19.15-.24.42-.12.64l2 3.46c.09.16.26.25.44.25.06 0 .12-.01.17-.03l2.49-1c.52.4 1.08.73 1.69.98l.38 2.65c.03.24.24.42.49.42h4c.25 0 .46-.18.49-.42l.38-2.65c.61-.25 1.17-.59 1.69-.98l2.49 1c.06.02.12.03.18.03.17 0 .34-.09.43-.25l2-3.46c.12-.22.07-.49-.12-.64l-2.11-1.65zm-1.98-1.71c.04.31.05.52.05.73 0 .21-.02.43-.05.73l-.14 1.13.89.7 1.08.84-.7 1.21-1.27-.51-1.04-.42-.9.68c-.43.32-.84.56-1.25.73l-1.06.43-.16 1.13-.2 1.35h-1.4l-.19-1.35-.16-1.13-1.06-.43c-.43-.18-.83-.41-1.23-.71l-.91-.7-1.06.43-1.27.51-.7-1.21 1.08-.84.89-.7-.14-1.13c-.03-.31-.05-.54-.05-.74s.02-.43.05-.73l.14-1.13-.89-.7-1.08-.84.7-1.21 1.27.51 1.04.42.9-.68c.43-.32.84-.56 1.25-.73l1.06-.43.16-1.13.2-1.35h1.39l.19 1.35.16 1.13 1.06.43c.43.18.83.41 1.23.71l.91.7 1.06-.43 1.27-.51.7 1.21-1.07.85-.89.7.14 1.13zM12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm0 6c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
        />
      </svg>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.config {
  cursor: pointer;
  position: absolute;
  bottom: 10px;
  left: 10px;

  .input {
    width: 100%;
    padding: 1em 10px;
    label[for] {
      cursor: pointer;
      margin-right: 10px;
    }
    input {
      width: 100%;
      color: #fff;
      border: none;
      border-bottom: 1px solid;
      padding: 6px 4px;
      border-radius: 5px 5px 0 0;
      &::placeholder {
        color: #8f8f8f;
        font-weight: 600;
      }
    }
  }
  .setSchool {
    position: relative;

    .schools {
      width: 100%;
      color: white;
      max-height: 200px;
      overflow-y: auto;
      position: absolute;
      bottom: 100%;
      background-color: rgb(104, 104, 104);
      border-radius: 5px;
      list-style: none;
      padding: 15px;
      li {
        cursor: pointer;
        padding: 5px;
        border-radius: 5px;
        &:hover {
          background-color: rgb(82, 82, 82);
        }
      }
    }
  }
}
</style>
