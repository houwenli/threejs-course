<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script setup>
import * as THREE from 'three';
import { ref, onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

  const material = new THREE.MeshStandardMaterial( {
    // color: 0x0000ff,
    // transparent: true, // 是否开启透明
    // opacity: 0.5, // 透明度 
  } );

  // threejs中的物品都是通过网格表示的
  // mesh需要形状和外观
  const mesh = new THREE.Mesh(geometry, material)
  // 可以设置物体的位置
  mesh.position.set(0, 0, 0)
  mesh.castShadow = true

  // 在场景中添加物品
  scene.add( mesh );

  // 添加辅助坐标系
  const axesHelper = new THREE.AxesHelper(200);
  scene.add( axesHelper );


  // 添加点光源
  const light = new THREE.PointLight( 0x0000ff, 1, 1000, 0 );
  light.position.set( 0, 100, -100);
  light.castShadow = true
  scene.add( light );

  const sphereSize = 10;
  const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
  scene.add( pointLightHelper );

  // const light1 = new THREE.PointLight( 0x00ff00, 1, 1000, 0 );
  // light1.position.set( 100, 0, 0);
  // scene.add( light1 );

  // const light2 = new THREE.PointLight( 0xff0000, 1, 1000, 0 );
  // light2.position.set( 0, 100, 0);
  // scene.add( light2 );

  // 环境光
  const light1 = new THREE.AmbientLight( 0x404040, 1 ); // 柔和的白光
  scene.add( light1 )

  // 平行光
  // 平行光意味着它的方向是从一个位置 position 到 target 的位置。 （而不是一个只有旋转分量的“自由平行光”）。
  const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
  directionalLight.position.set( 100, 100, 100);
  // target不设置，默认就是坐标原点
  directionalLight.target = mesh;
  directionalLight.castShadow = true

  scene.add( directionalLight );

  const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 10 );
  scene.add( directionalLightHelper );

  // 聚光源
  const spotLight = new THREE.SpotLight(0xffffff,1.0);
  spotLight.position.set(-100, 100, -100)

  spotLight.castShadow = true

  spotLight.target = mesh
  spotLight.angle = Math.PI / 4;
  scene.add(spotLight);//光源添加到场景中
  // 聚光源辅助对象，可视化聚光源
  const spotLightHelper = new THREE.SpotLightHelper(spotLight,0xffffff)
  scene.add(spotLightHelper);

  // 纹理贴图加载器TextureLoader
  const texLoader = new THREE.TextureLoader();
  const tileGeometry = new THREE.PlaneGeometry(2000, 2000);
  // .load()方法加载图像，返回一个纹理对象Texture
  const tileTexture = texLoader.load(new URL('../textureLoader/tile.png', import.meta.url).href);
  // 设置阵列模式
  tileTexture.wrapS = THREE.RepeatWrapping;
  tileTexture.wrapT = THREE.RepeatWrapping;
  tileTexture.repeat.set(12,12)
  const tileMaterial = new THREE.MeshLambertMaterial({
      // 设置纹理贴图：Texture对象作为材质map属性的属性值
      map: tileTexture,//map表示材质的颜色贴图属性
      side: THREE.DoubleSide
  });
  const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
  tileMesh.receiveShadow = true;

  tileMesh.rotateX(-Math.PI/2)
  tileMesh.position.y = -60

  scene.add( tileMesh );


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
  renderer.shadowMap.enabled = true; 
  renderer.render(scene, camera)

  // 最后把渲染结果给渲染到页面上
  canvas.value.appendChild(renderer.domElement)

  
  console.log(canvas.value)

  const controls = new OrbitControls( camera, renderer.domElement );
  // controls.autoRotate = true
  controls.enableDamping = true
  controls.dampingFactor = 0.05


  
  function animate() {
    requestAnimationFrame( animate );
    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();
    renderer.render( scene, camera );
  }
  animate()
})


</script>

<style scoped>
.canvas {
  width: 100%;
  height: 100%;
}
</style>
