<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script setup>
import * as THREE from "three";
import { ref, onMounted } from "vue";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min'

const canvas = ref(null);

onMounted(() => {
  /**
   * 创建虚拟的3D场景
   */
  const scene = new THREE.Scene();

  const sphereGeometry = new THREE.SphereGeometry(1, 20, 20); //球体
  const material = new THREE.MeshStandardMaterial(); //材质
  const sphere = new THREE.Mesh(sphereGeometry, material); //实物
  sphere.castShadow = true; //投射阴影
  scene.add(sphere); //场景加入物体

  // 创建平面
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const plane = new THREE.Mesh(planeGeometry, material); //创建平面
  plane.position.set(0, -1, 0); //设置位置
  plane.receiveShadow = true; //接收阴影
  plane.rotation.x = -Math.PI / 2; //旋转
  scene.add(plane); //添加场景

  const light = new THREE.AmbientLight("#fff", 0.5);
  scene.add(light);

  // 太阳光也称直线光源
  const directionalLight = new THREE.DirectionalLight("#fff", 0.5); //不设置位置默认从y轴过来
  directionalLight.position.set(10, 10, 10);
  directionalLight.castShadow = true; //光照投射阴影

  directionalLight.shadow.radius = 20; //设置阴影模糊度
  directionalLight.shadow.mapSize.set(2048, 2048); //设置阴影贴图的分辨率
  // 设置平行光投射相机的属性---》远近上下左右
  directionalLight.shadow.camera.near = 0.5;
  directionalLight.shadow.camera.far = 500;
  directionalLight.shadow.camera.top = 5;
  directionalLight.shadow.camera.bottom = -5;
  directionalLight.shadow.camera.left = -5;
  directionalLight.shadow.camera.right = 5;

  scene.add(directionalLight);

  const gui = new GUI();
  gui
    .add(directionalLight.shadow.camera, "near")
    .min(0)
    .max(10)
    .step(0.1)
    .onChange(() => {
      directionalLight.shadow.camera.updateProjectionMatrix(); //灯光距离改变时重新渲染
    });

  /**
   * 现实世界中，如果需要看到物体的样貌，需要通过人的眼睛
   * 如果想把自己看到的东西给别人看此时就需要相机来帮忙，把当前画面定格住
   * threejs中同样的道理
   * 我们需要一个相机把我们刚才的物品拍下来，当然我们的相机可以出现在不同的位置，然后拍出物体不同角度的照片
   */

  // 透视投影相机
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.value.clientWidth / canvas.value.clientHeight,
    1,
    1000
  );
  // 设置相机的位置
  camera.position.set(10, 10, 10);
  // 设置相机拍照的视线方向
  // camera.lookAt(0, 0, 0)
  // 看向某一个物体的位置，指向某个网格模型
  camera.lookAt(sphere.position);

  scene.add(camera);

  /**
   * 现实生活中，有了景物和相机，如果想要获得一张照片，就需要拿着相机按下快门完成拍照，获得照片。
   * 这一系列的操作在threejs中就需要一个新的对象完成，渲染器WebGLRenderer
   */

  //  创建WebGL渲染器
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
  renderer.shadowMap.enabled = true;
  renderer.render(scene, camera);

  // 最后把渲染结果给渲染到页面上
  canvas.value.appendChild(renderer.domElement);

  console.log(canvas.value);

  const controls = new OrbitControls(camera, renderer.domElement);
  // controls.autoRotate = true
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  function animate() {
    requestAnimationFrame(animate);
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
});
</script>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
