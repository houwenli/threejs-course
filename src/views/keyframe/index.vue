<template>
  <div class="canvas" ref="canvas"></div>
  <button @click="stopFrame">停止</button>
  <button @click="palyFrame">播放</button>
  <button @click="pausedFrame">暂停/播放</button>
</template>

<script setup>
import * as THREE from 'three';
import { ref, onMounted, reactive } from 'vue'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
// 引入stats性能监视器
import Stats from 'three/examples/jsm/libs/stats.module.js'

import {model, mixer as modelMixer} from './model';

const canvas = ref(null);

let clipAction = reactive(null)

const pausedFrame = () => {
  if (clipAction.paused){
    clipAction.paused = false
  } else {
    clipAction.paused = true
  }
}

const stopFrame = () => {
  clipAction.stop()
}

const palyFrame = () => {
  clipAction.play()
}

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
    color: 0x0000ff,
    // transparent: true, // 是否开启透明
    // opacity: 0.5, // 透明度 
    // side: THREE.DoubleSide
  } );

  // threejs中的物品都是通过网格表示的
  // mesh需要形状和外观
  const mesh = new THREE.Mesh(geometry, material)
  // 可以设置物体的位置
  mesh.position.set(0, 0, 0)

  // 在场景中添加物品
  scene.add( mesh );

  // 给需要设置关键帧动画的模型命名
  mesh.name = "Box";
  const times = [0, 3, 6]; //时间轴上，设置三个时刻0、3、6秒
  // times中三个不同时间点，物体分别对应values中的三个xyz坐标
  const values = [0, 0, 0, 100, 0, 0, 0, 0, 100];
  // 0~3秒，物体从(0,0,0)逐渐移动到(100,0,0),3~6秒逐渐从(100,0,0)移动到(0,0,100)
  const posKF = new THREE.KeyframeTrack('Box.position', times, values);
  // 从2秒到5秒，物体从红色逐渐变化为蓝色
  const colorKF = new THREE.KeyframeTrack('Box.material.color', [2, 5], [1, 0, 0, 0, 0, 1]);
  // 1.3 基于关键帧数据，创建一个clip关键帧动画对象，命名"test"，持续时间6秒。
  const clip = new THREE.AnimationClip("test", 5, [posKF, colorKF]);
  // clip.times
  //包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
  const mixer = new THREE.AnimationMixer(mesh);
  //AnimationMixer的`.clipAction()`返回一个AnimationAction对象
  clipAction = mixer.clipAction(clip); 
  //.play()控制动画播放，默认循环播放
  clipAction.play(); 
  //不循环播放，执行一次后默认回到动画开头
  // clipAction.loop = THREE.LoopOnce; 

  // 物体状态停留在动画结束的时候
  clipAction.clampWhenFinished = true;

  //动画停止结束，回到开始状态
  // clipAction.stop();
  // mixer.update(4)

  clipAction.time = 2; 

  scene.add(model)


  // 添加一个长方体
  const geometry1 = new THREE.BoxGeometry( 100, 100, 100 );
  
  // 为geometry提供变形目标的顶点数据(注意和原始geometry顶点数量一致)
  const target1 = new THREE.BoxGeometry(100, 200, 100).attributes.position;//变高
  const target2 = new THREE.BoxGeometry(20, 100, 20).attributes.position;//变细

  geometry1.morphAttributes.position = [target1, target2];

  const mesh1 = new THREE.Mesh(geometry1, material);
  mesh1.position.z = 300

  // mesh1.morphTargetInfluences[0] = 0.5;
  // mesh1.morphTargetInfluences[1] = 0.5;
  mesh1.name = "Box1"
  const KF1 = new THREE.KeyframeTrack('Box1.morphTargetInfluences[0]', [0, 5], [0, 1]);
  const KF2 = new THREE.KeyframeTrack('Box1.morphTargetInfluences[1]', [0, 5], [0, 1]);
  const clip1 = new THREE.AnimationClip("t", 5, [KF1, KF2]);
  // 播放变形动画
  const mixer1 = new THREE.AnimationMixer(mesh1);
  const clipAction1 = mixer1.clipAction(clip1);
  clipAction1.play();

  scene.add(mesh1)
  

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
  const pmremGenerator = new THREE.PMREMGenerator( renderer );
  scene.background = new THREE.Color( 0xbfe3dd );
			scene.environment = pmremGenerator.fromScene( new RoomEnvironment( renderer ), 0.04 ).texture;

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


  const clock = new THREE.Clock() // 创建一个时钟对象
  function animate() {
    stats.update()

    const spt = clock.getDelta()
    // console.log('spt', spt)

    // 自动旋转
    // mesh.rotateY(0.01)

    requestAnimationFrame( animate );

    // required if controls.enableDamping or controls.autoRotate are set to true
    controls.update();

    // 更新播放器相关的时间
    mixer.update(spt);
    mixer1.update(spt);
    if (modelMixer !== null) {
         // 更新播放器相关的时间
         modelMixer.update(spt);
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
