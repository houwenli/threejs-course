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

  const objects = []

  /**
   * 现实世界中，如果需要看到物体的样貌，需要通过人的眼睛
   * 如果想把自己看到的东西给别人看此时就需要相机来帮忙，把当前画面定格住
   * threejs中同样的道理
   * 我们需要一个相机把我们刚才的物品拍下来，当然我们的相机可以出现在不同的位置，然后拍出物体不同角度的照片
   */

  // 透视投影相机
  const camera = new THREE.PerspectiveCamera( 45, canvas.value.clientWidth / canvas.value.clientHeight, 1, 10000 );
  // const camera = new THREE.PerspectiveCamera( 90, canvas.value.clientWidth / canvas.value.clientHeight, 1, 10000 );
  // 设置相机的位置
  camera.position.set(300, 300, 300)
  // 设置相机拍照的视线方向
  // camera.lookAt(1000, 0, 1000)
  // 看向某一个物体的位置，指向某个网格模型
  // camera.lookAt(200, 200, 200)

  scene.add( camera );
  scene.background = new THREE.Color(0xf0f0f0)

  /**
   * 现实生活中，有了景物和相机，如果想要获得一张照片，就需要拿着相机按下快门完成拍照，获得照片。
   * 这一系列的操作在threejs中就需要一个新的对象完成，渲染器WebGLRenderer
   */

  //  创建WebGL渲染器
  const renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  // renderer.antialias = true 
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
  renderer.render(scene, camera)
  renderer.setPixelRatio(window.devicePixelRatio);
  // renderer.setClearColor(0x111111, 0.5)

  // 最后把渲染结果给渲染到页面上
  canvas.value.appendChild(renderer.domElement)

  // 相机轨道控制器
  const controls = new OrbitControls( camera, renderer.domElement );
  // 设置观察点
  controls.target.set(0, 0, 0)
  // 滑轨自动旋转
  // controls.autoRotate = true
  // controls.enableDamping = true
  // controls.dampingFactor = 0.05
  // controls.addEventListener('change', function() {
  //   renderer.render( scene, camera );
  //   console.log(camera.position)
  // })

  // 添加渲染帧率
  const stats = new Stats()
  stats.setMode(1)
  document.querySelector('.el-main').appendChild(stats.domElement)


  // 添加网格辅助器
  const gridHelper = new THREE.GridHelper( 1000, 20 );
	scene.add( gridHelper );

  // 辅助箱子
  const rollOverGeo = new THREE.BoxGeometry( 50, 50, 50 );
  const rollOverMaterial = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: 0.5, transparent: true } );
  const rollOverMesh = new THREE.Mesh( rollOverGeo, rollOverMaterial );
  scene.add( rollOverMesh );

  // 添加真正的箱子
  const map = new THREE.TextureLoader().load( new URL('./image.png', import.meta.url).href );
  map.colorSpace = THREE.SRGBColorSpace;
  const cubeGeo = new THREE.BoxGeometry( 50, 50, 50 );
	const cubeMaterial = new THREE.MeshLambertMaterial( { color: 0xfeb74c, map: map } );
  const cubeMesh = new THREE.Mesh(cubeGeo, cubeMaterial)
  scene.add( cubeMesh );

  // 棋盘,主要是位置射线拾取棋盘的位置
  const geometry = new THREE.PlaneGeometry( 1000, 1000 );
  geometry.rotateX( - Math.PI / 2 );

  const plane = new THREE.Mesh( geometry, new THREE.MeshBasicMaterial( { visible: false } ) );
  scene.add( plane );
  objects.push(plane)

  // 射线拾取器
  const raycaster = new THREE.Raycaster();
	const pointer = new THREE.Vector2();

  // 光源
  const ambientLight = new THREE.AmbientLight( 0x606060, 3 );
  scene.add( ambientLight );

  const directionalLight = new THREE.DirectionalLight( 0xffffff, 3 );
  directionalLight.position.set( 1, 0.75, 0.5 ).normalize();
  scene.add( directionalLight );

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

  document.addEventListener( 'pointermove', onPointerMove );

  function onPointerMove(event) {
    pointer.set( ( event.clientX / canvas.value.clientWidth ) * 2 - 1, - ( event.clientY / canvas.value.clientHeight ) * 2 + 1 );
    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObjects(objects, false)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      rollOverMesh.position.copy( intersect.point ).add( intersect.face.normal )
      rollOverMesh.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
    }
  }

  document.addEventListener( 'pointerdown', onPointerDown );

  function onPointerDown(event) {
    pointer.set( ( event.clientX / canvas.value.clientWidth ) * 2 - 1, - ( event.clientY / canvas.value.clientHeight ) * 2 + 1 );
    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObjects(objects, false)
    if (intersects.length > 0) {
      const intersect = intersects[0]
      const voxel = new THREE.Mesh( cubeGeo, cubeMaterial );
      voxel.position.copy( intersect.point ).add( intersect.face.normal );
      voxel.position.divideScalar( 50 ).floor().multiplyScalar( 50 ).addScalar( 25 );
      scene.add( voxel );

      objects.push( voxel );
    }
  }

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
