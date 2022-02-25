<script setup lang="ts">
import axios from "axios";

const { data } = await axios({
  url: "https://www.google.com/complete/search?q=awa&cp=3&client=gws-wiz&xssi=t&hl=zh-TW&authuser=0&pq=awa&psi=t9IYYoGdJ4mGr7wPtP-h6A8.1645793980086&dpr=1.100000023841858",
  method: "GET",
});
console.log(data);
</script>

<template>
  <div>
    <input
      placeholder="搜尋 Google 或輸入網址"
      autocomplete="off"
      spellcheck="false"
      type="search"
      name=""
      id=""
      focus
      focusout
      blur
      click
      keydown
      keyup
      input
      paste
    />
  </div>
</template>

<style lang="scss" scoped></style>
