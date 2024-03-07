<template>
  <div class="barBg">
    <div class="btn" :class="nowIndex === index ? 'actived' : ''" v-for="(item, index) in tabList" :key="item.id"
        @click="clickTab(item.router, index)">
        <span>{{ item.name }}</span>
    </div>
  </div>
</template>

<script setup>
  // 引入路由
  import { useRouter } from 'vue-router'
  import { ref } from 'vue'
  import routes from '../router/routes'

  const router = useRouter()
  
  const nowIndex = ref(0)

  const clickTab = (e, index) => {
    nowIndex.value = index
    router.push(e)
  }

  let curRoutes = routes[1].children
  let id = 1
  const tabList = curRoutes.map(item => {
    return {
      id: ++id, name: item.title, router: item.path, 
    }
  })
</script>

<style scoped>
.barBg {
  padding: 50px 3px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.btn {
  width: 100%;
  cursor: pointer;
}

.actived {
  background-color: cadetblue
}
</style>
