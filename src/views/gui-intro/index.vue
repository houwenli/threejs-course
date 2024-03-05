<template>
  <input type="text" v-model="obj.x">
  <div id="gui-wraper"></div>
</template>

<script setup>
import { onMounted, ref, watchEffect } from 'vue'
import { GUI } from 'three/examples/jsm/libs/lil-gui.module.min'

const obj = ref({
  x: 30,
  y: 0.5,
  z: 1000
})

watchEffect(() => {
  console.log(obj.value.x)
})

onMounted(() => {
  
  const gui = new GUI({
    container: document.getElementById('gui-wraper')
  })

  gui.domElement.style.right = '0px'
  gui.domElement.style.top = '100px'

  

  gui.add(obj.value, 'x', 0, 100)
  gui.add(obj.value, 'y', 0, 1)
  gui.add(obj.value, 'z', 500, 2000)

})


</script>

<style scoped>

</style>
