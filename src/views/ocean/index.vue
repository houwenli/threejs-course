<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script setup>
import * as THREE from "three";
import { ref, onMounted } from "vue";

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Water } from "three/addons/objects/Water.js";
import { Sky } from "three/addons/objects/Sky.js";
// 引入stats性能监视器
import Stats from "three/examples/jsm/libs/stats.module.js";

const canvas = ref(null);

onMounted(() => {
  /**
   * 创建虚拟的3D场景
   */
  const scene = new THREE.Scene();

  // 透视投影相机
  const camera = new THREE.PerspectiveCamera(
    45,
    canvas.value.clientWidth / canvas.value.clientHeight,
    1,
    20000
  );
  // const camera = new THREE.PerspectiveCamera( 90, canvas.value.clientWidth / canvas.value.clientHeight, 1, 10000 );
  // 设置相机的位置
  camera.position.set(300, 300, 300);
  // 设置相机拍照的视线方向
  // camera.lookAt(1000, 0, 1000)
  // 看向某一个物体的位置，指向某个网格模型
  // camera.lookAt(200, 200, 200)

  scene.add(camera);

  //  创建WebGL渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
  });
  // renderer.antialias = true
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);
  renderer.render(scene, camera);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.5;
  // renderer.setClearColor(0x111111, 0.5)

  // 最后把渲染结果给渲染到页面上
  canvas.value.appendChild(renderer.domElement);

  // 水面
  const waterGeometry = new THREE.PlaneGeometry(10000, 10000);
  const water = new Water(waterGeometry, {
    textureWidth: 512,
    textureHeight: 512,
    waterNormals: new THREE.TextureLoader().load(
      new URL("./image.png", import.meta.url).href,
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
      }
    ),
    sunDirection: new THREE.Vector3(),
    sunColor: 0xffffff,
    waterColor: 0x001e0f,
    distortionScale: 3.7,
    fog: scene.fog !== undefined,
  });
  water.rotation.x = -Math.PI / 2;
  scene.add(water);

  // 天空
  const sky = new Sky();
  sky.scale.setScalar(10000);
  scene.add(sky);
  const skyUniforms = sky.material.uniforms;

  skyUniforms["turbidity"].value = 10;
  skyUniforms["rayleigh"].value = 2;
  skyUniforms["mieCoefficient"].value = 0.005;
  skyUniforms["mieDirectionalG"].value = 0.8;

  // 太阳
  const sun = new THREE.Vector3();
  const parameters = {
    elevation: 2,
    azimuth: 180,
  };

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  const sceneEnv = new THREE.Scene();

  let renderTarget;

  function updateSun() {
    const phi = THREE.MathUtils.degToRad(90 - parameters.elevation);
    const theta = THREE.MathUtils.degToRad(parameters.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    sky.material.uniforms["sunPosition"].value.copy(sun);
    water.material.uniforms["sunDirection"].value.copy(sun).normalize();

    if (renderTarget !== undefined) renderTarget.dispose();

    sceneEnv.add(sky);
    renderTarget = pmremGenerator.fromScene(sceneEnv);
    scene.add(sky);

    scene.environment = renderTarget.texture;
  }

  updateSun();

  const geometry = new THREE.BoxGeometry(30, 30, 30);
  const material = new THREE.MeshStandardMaterial({ roughness: 0 });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 相机轨道控制器
  const controls = new OrbitControls(camera, renderer.domElement);
  // 设置观察点
  controls.target.set(0, 10, 0);
  controls.minDistance = 40.0;
	controls.maxDistance = 200.0;
  controls.maxPolarAngle = Math.PI * 0.495;
  // controls
  // 滑轨自动旋转
  // controls.autoRotate = true
  // controls.enableDamping = true
  // controls.dampingFactor = 0.05
  // controls.addEventListener('change', function() {
  //   renderer.render( scene, camera );
  //   console.log(camera.position)
  // })

  // 添加渲染帧率
  const stats = new Stats();
  stats.setMode(1);
  document.querySelector(".el-main").appendChild(stats.domElement);

  // const clock = new THREE.Clock() // 创建一个时钟对象
  function animate() {
    stats.update();

    // const spt = clock.getDelta() * 1000
    // console.log('spt', spt)

    // 自动旋转
    // mesh.rotateY(0.01)

    requestAnimationFrame(animate);

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    const time = performance.now() * 0.001;

    mesh.position.y = Math.sin(time) * 20 + 5;
    mesh.rotation.x = time * 0.5;
    mesh.rotation.z = time * 0.51;

    water.material.uniforms["time"].value += 1.0 / 60.0;

    renderer.render(scene, camera);
  }
  animate();

  window.onresize = function () {
    // 重置渲染器的尺寸
    renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight);

    // 设置相机的宽高比
    camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight;

    // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
    // 但是不会每渲染一帧就通过相机的属性计算投影矩阵
    // 如果相机的一些属性发生了变化,需要执行updateProjectionMatrix
    // 不更新的话,视锥体就不会发生变化
    camera.updateProjectionMatrix();
  };
});
</script>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
