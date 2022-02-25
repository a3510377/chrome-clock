<script setup lang="ts">
import { onBeforeUnmount, ref } from "vue";
import axios from "axios";

const covid = ref<{
  updated: number;
  country: string;
  countryInfo: {
    _id: number;
    iso2: string;
    iso3: string;
    lat: number;
    long: number;
    flag: string;
  };
  continent: string;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
}>();
let updatedTime = ref<string>();

axios("https://disease.sh/v3/covid-19/countries/TW").then(({ data }) => {
  covid.value = data;
  let time = new Date(data.updated);

  updatedTime.value = `${[
    time.getFullYear(),
    time.getMonth() + 1,
    time.getDate(),
  ].join("-")} ${time.toLocaleTimeString()}`;
});
</script>

<template>
  <div
    class="covid flex flex-center flex-item-center"
    :title="`上次更新時間 ${updatedTime}`"
  >
    <div class="img">
      <img :src="covid?.countryInfo.flag" alt="" />
    </div>
    <div class="" title="今天的案例">
      <div v-text="covid?.todayCases" />
    </div>
    <div class="" title="活動案例總數">
      <div v-text="covid?.active" />
    </div>
    <div class="" title="康復病例總數">
      <div v-text="covid?.recovered" />
    </div>
    <div class="" title="總死亡人數">
      <div v-text="covid?.deaths" />
    </div>
  </div>
</template>

<style lang="scss" scoped></style>
