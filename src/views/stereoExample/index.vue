<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script setup>
import * as THREE from 'three';
import { ref,reactive, onMounted } from 'vue'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { LightProbeGenerator } from 'three/examples/jsm/lights/LightProbeGenerator.js';
// 引入stats性能监视器
import Stats from 'three/examples/jsm/libs/stats.module.js'

const canvas = ref(null);
let spheres = reactive([])

onMounted(() => {
  /**
   * 创建虚拟的3D场景
   */
  const scene = new THREE.Scene()

  // light
  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.6 );
				directionalLight.position.set( 10, 10, 10 );
				scene.add( directionalLight );

  // probe
  const lightProbe = new THREE.LightProbe();
				scene.add( lightProbe );

  const textureCube = new THREE.CubeTextureLoader()
    .setPath(`${new URL('./scene', import.meta.url).pathname}/`)
    .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
  // const textureCube = new THREE.CubeTextureLoader()
  //   .setPath(`${new URL('./test', import.meta.url).pathname}/`)
  //   .load(['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']);
  
  scene.background = textureCube

  const geometry = new THREE.SphereGeometry( 100, 32, 16 );
  textureCube.mapping = THREE.CubeRefractionMapping;
  // const material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube, refractionRatio: 0.95 } );

  const material = new THREE.MeshStandardMaterial( {
						color: 0xffffff,
						metalness: 0,
						roughness: 0,
						envMap: textureCube,
						envMapIntensity: 1,
					} );

  const random = () => {
    return Math.random() * 10000 - 5000
  }

  // 批量创建球体
  for (let i = 0; i < 500; i++) {
    const mesh = new THREE.Mesh( geometry, material );
    mesh.position.set(random(), random(), random())
    mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3;
    scene.add( mesh );
    spheres.push(mesh)
  }


  // // 添加点光源
  // const light = new THREE.PointLight( 0xffffff, 1, 10000, 0 );
  // light.position.set( 0, 500, 800);
  // scene.add( light );


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
  renderer.setClearColor(0x111111, 0.5)

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

    const timer = 0.0001 * Date.now();
    // 让球体动起来
    for ( let i = 0, il = spheres.length; i < il; i ++ ) {
      const sphere = spheres[ i ];
      sphere.position.x = 5000 * Math.cos( timer + i * 1 );
			sphere.position.y = 5000 * Math.sin( timer + i *1.1 );
    }
    


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
