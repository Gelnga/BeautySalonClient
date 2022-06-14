<template>
  <Header />
  <main class="main">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import Header from "./components/Header.vue";
</script>


<style>
@import "@/style/common.css";
@import "@/style/app.css";
@import "../node_modules/bootstrap";
</style>
