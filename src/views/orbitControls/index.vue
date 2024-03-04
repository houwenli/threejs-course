<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script setup>
import * as THREE from 'three';
import { ref, onMounted } from 'vue'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
// 引入stats性能监视器
import Stats from 'three/examples/jsm/libs/stats.module.js'

const canvas = ref(null);

onMounted(() => {
  /**
   * 创建虚拟的3D场景
   */
  const scene = new THREE.Scene()

  // 往场景中添加物品
  // 添加一个长方体
  const geometry = new THREE.BoxGeometry( 100, 100, 100 );

  // 此时需要给长方体添加一个外部材质
  // 不受光照影响
  // const material = new THREE.MeshBasicMaterial( {
  //   color: 0x0000ff,
  //   transparent: true, // 是否开启透明
  //   opacity: 0.5, // 透明度 
  // } );

  const material = new THREE.MeshLambertMaterial( {
    // color: 0x0000ff,
    transparent: true, // 是否开启透明
    opacity: 0.5, // 透明度 
  } );

  // threejs中的物品都是通过网格表示的
  // mesh需要形状和外观
  const mesh = new THREE.Mesh(geometry, material)
  // 可以设置物体的位置
  mesh.position.set(0, 0, 0)

  // 在场景中添加物品
  scene.add( mesh );

  // 批量创建长方体,测试一下性能
  const num = 1000
  for(let i = 0; i < num; i++) {
    const geometry = new THREE.BoxGeometry( 10, 10, 10 );
    const material = new THREE.MeshLambertMaterial( {
      // color: 0x0000ff,
      transparent: true, // 是否开启透明
      opacity: 0.5, // 透明度 
    } );
    const mesh = new THREE.Mesh(geometry, material)
    // 可以设置物体的位置
    const x = (Math.random() - 0.5) * 200
    const y = (Math.random() - 0.5) * 200
    const z = (Math.random() - 0.5) * 200
    mesh.position.set(x, y, z)

    // 在场景中添加物品
    scene.add( mesh );
  }

  // 添加辅助坐标系
  const axesHelper = new THREE.AxesHelper(200);
  scene.add( axesHelper );


  // 添加点光源
  const light = new THREE.PointLight( 0x0000ff, 1, 1000, 0 );
  light.position.set( 0, 0, 100);
  scene.add( light );

  const light1 = new THREE.PointLight( 0x00ff00, 1, 1000, 0 );
  light1.position.set( 100, 0, 0);
  scene.add( light1 );

  const light2 = new THREE.PointLight( 0xff0000, 1, 1000, 0 );
  light2.position.set( 0, 100, 0);
  scene.add( light2 );


  /**
   * 现实世界中，如果需要看到物体的样貌，需要通过人的眼睛
   * 如果想把自己看到的东西给别人看此时就需要相机来帮忙，把当前画面定格住
   * threejs中同样的道理
   * 我们需要一个相机把我们刚才的物品拍下来，当然我们的相机可以出现在不同的位置，然后拍出物体不同角度的照片
   */

  // 透视投影相机
  const camera = new THREE.PerspectiveCamera( 45, canvas.value.clientWidth / canvas.value.clientHeight, 1, 1000 );
  // 设置相机的位置
  camera.position.set(200, 200, 200)
  // 设置相机拍照的视线方向
  // camera.lookAt(0, 0, 0)
  // 看向某一个物体的位置，指向某个网格模型
  camera.lookAt(mesh.position)

  scene.add( camera );

  /**
   * 现实生活中，有了景物和相机，如果想要获得一张照片，就需要拿着相机按下快门完成拍照，获得照片。
   * 这一系列的操作在threejs中就需要一个新的对象完成，渲染器WebGLRenderer
   */

  //  创建WebGL渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
  renderer.render(scene, camera)

  // 最后把渲染结果给渲染到页面上
  canvas.value.appendChild(renderer.domElement)

  const controls = new OrbitControls( camera, renderer.domElement );
  // 滑轨自动旋转
  // controls.autoRotate = true
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  // controls.addEventListener('change', function() {
  //   renderer.render( scene, camera );
  //   console.log(camera.position)
  // })

  // 添加渲染帧率
  const stats = new Stats()
  stats.setMode(1)
  document.querySelector('.el-main').appendChild(stats.domElement)


  // const clock = new THREE.Clock() // 创建一个时钟对象
  function animate() {
    stats.update()

    // const spt = clock.getDelta() * 1000
    // console.log('spt', spt)

    // 自动旋转
    // mesh.rotateY(0.01)

    requestAnimationFrame( animate );

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    renderer.render( scene, camera );

  }
  animate()

  window.onresize = function() {
    // 重置渲染器的尺寸
    renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
    
    // 设置相机的宽高比
    camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight

    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧就通过相机的属性计算投影矩阵
    // 如果相机的一些属性发生了变化,需要执行updateProjectionMatrix
    // 不更新的话,视锥体就不会发生变化
    camera.updateProjectionMatrix()


    
  }


})


</script>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
