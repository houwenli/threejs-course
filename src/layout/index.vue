<template>
  <div class="el-container">
    <div class="el-slide">
      <Bar />
    </div>
    <div class="el-main">
      <!-- 子路由出口 -->
      <router-view />
    </div>
  </div>
</template>
  
<script setup lang="ts">
import Bar from './header.vue'
 
</script>
  
<style scoped lang="scss">
.el-container {
  width: 100%;
  height: 100vh;
  display: flex;
}

.el-slide {
  width: 128px;
  height: 100vh;
  background-color: darkslategrey;
  color: #ffffff
}
 
.el-main {
  width: calc(100% - 128px);
  background-color: #E9EEF3;
  transform: translateZ(0);
}
</style>