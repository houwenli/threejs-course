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

import rectangle from './rectangle'

onMounted(() => {
  /**
   * 创建虚拟的3D场景
   */
  const scene = new THREE.Scene()

  const geometry = new THREE.PlaneGeometry(200, 100); 
  // const geometry = new THREE.BoxGeometry(100, 100, 100)
  // const geometry = new THREE.SphereGeometry(100)
  // 纹理贴图加载器TextureLoader
  const texLoader = new THREE.TextureLoader();

  // const texture = texLoader.load(new URL('./earth.jpg', import.meta.url).href);
  // const texture = texLoader.load(new URL('./test.png', import.meta.url).href);
  const texture = texLoader.load(new URL('./cropped.jpg', import.meta.url).href);

  // console.log(texture)
  const material = new THREE.MeshBasicMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: texture, // map表示材质的颜色贴图属性
    side: THREE.both
  });

  const mesh = new THREE.Mesh(geometry, material)
  // scene.add( mesh );

  scene.add(rectangle)


  const planeGeometry = new THREE.PlaneGeometry(100, 100);
  const uvs = new Float32Array([
    0, 1,
    0.5, 1,
    0, 0,
    0.5, 0
  ]);
  // 设置几何体attributes属性的位置normal属性
  planeGeometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标
  const planeMesh = new THREE.Mesh(planeGeometry, material)
  planeMesh.position.set(250, 0, 0)
  scene.add( planeMesh );

  // 圆形平面
  const circleGeometry = new THREE.CircleGeometry(50);
  const circleMesh = new THREE.Mesh(circleGeometry, material)
  circleMesh.position.set(0, 0, 100)
  scene.add( circleMesh );

 
  const tileGeometry = new THREE.PlaneGeometry(2000, 2000);
  // .load()方法加载图像，返回一个纹理对象Texture
  const tileTexture = texLoader.load(new URL('./tile.png', import.meta.url).href);
  // 设置阵列模式
  tileTexture.wrapS = THREE.RepeatWrapping;
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.repeat.set(12,12)
  const tileMaterial = new THREE.MeshLambertMaterial({
      // 设置纹理贴图：Texture对象作为材质map属性的属性值
      map: tileTexture,//map表示材质的颜色贴图属性
      // side: THREE.DoubleSide
  });
  const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);

  tileMesh.rotateX(-Math.PI/2)

  // scene.add( tileMesh );


  // 添加地面辅助观察
  const gridHelper = new THREE.GridHelper(500, 25, 0x0000ff, 0x00ff00)
  scene.add( gridHelper );

  const pngGeometry = new THREE.PlaneGeometry(1000, 132);
  // .load()方法加载图像，返回一个纹理对象Texture
  const pngTexture = texLoader.setPath(new URL('./', import.meta.url).pathname).load('/png.png');
  // const pngTexture = texLoader.load('src/views/textureLoader/png.png');
  // pngTexture.offset.x = 0.4
  // pngTexture.offset.y = 0.1
  pngTexture.wrapS = THREE.RepeatWrapping;
  pngTexture.wrapT = THREE.RepeatWrapping;
  pngTexture.repeat.set(10, 1)
  const pngMaterial = new THREE.MeshBasicMaterial({
      // 设置纹理贴图：Texture对象作为材质map属性的属性值
      map: pngTexture,//map表示材质的颜色贴图属性
      // side: THREE.DoubleSide
      transparent: true
  });
  const pngMesh = new THREE.Mesh(pngGeometry, pngMaterial);
  pngMesh.rotateX(-Math.PI/2)
  scene.add( pngMesh );


  // 添加辅助坐标系
  const axesHelper = new THREE.AxesHelper(200);
  scene.add( axesHelper );


  // 添加点光源
  const light = new THREE.PointLight( 0xffffff, 1, 10000, 0 );
  light.position.set( 0, 500, 800);
  scene.add( light );


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
  camera.position.set(500, 500, 500)
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

    pngTexture.offset.x += 0.01

    // const spt = clock.getDelta() * 1000
    // console.log('spt', spt)

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
