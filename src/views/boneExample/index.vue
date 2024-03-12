<template>
  <div class="canvas" ref="canvas"></div>
</template>

<script setup>
import * as THREE from 'three';
import { ref, reactive, onMounted } from 'vue'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls.js';
import { CCDIKSolver, CCDIKHelper } from 'three/examples/jsm/animation/CCDIKSolver.js';
// 引入stats性能监视器
import Stats from 'three/examples/jsm/libs/stats.module.js'
import {GUI} from 'three/addons/libs/lil-gui.module.min.js';

// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
// 创建GLTF加载器对象
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath(new URL('./', import.meta.url).pathname + '/gltf/');
loader.setDRACOLoader( dracoLoader );


const canvas = ref(null);
const OOI = reactive({});
let IKSolver = reactive({});
let mirrorSphereCamera = reactive({});
let transformControls = reactive({});

onMounted(async () => {
  /**
   * 创建虚拟的3D场景
   */
  const scene = new THREE.Scene()
  scene.fog = new THREE.FogExp2(0xffffff, 0.17)
  scene.background = new THREE.Color(0xfffffff)

  // 照相机
  const camera = new THREE.PerspectiveCamera( 55, canvas.value.clientWidth / canvas.value.clientHeight, 0.01, 10000 );
  camera.position.set( -1.556597229247752, 1.4905696902003092, -0.49258495043940853 );
  camera.lookAt(scene.position)
  scene.add( camera );
  // 渲染
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    logarithmicDepthBuffer: true
  });
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
  renderer.render(scene, camera)
  renderer.setPixelRatio(window.devicePixelRatio);
  // 最后把渲染结果给渲染到页面上
  canvas.value.appendChild(renderer.domElement)

  // 相机轨道控制器
  const controls = new OrbitControls( camera, renderer.domElement );
  // 设置观察点
  // controls.target.set(0, 0, 0)

  // 添加辅助坐标系
  const axesHelper = new THREE.AxesHelper(200);
  scene.add( axesHelper );


  // 添加平行光
  const ambientLight = new THREE.AmbientLight(0xffffff, 8)
  scene.add(ambientLight)


  // 添加模型
  const gltf = await loader.loadAsync(new URL('./model/kira.glb', import.meta.url).href)
  console.log(gltf)
  scene.add(gltf.scene)
  gltf.scene.traverse(n => {
    if ( n.name === 'head' ) OOI.head = n;
    if ( n.name === 'lowerarm_l' ) OOI.lowerarm_l = n;
    if ( n.name === 'Upperarm_l' ) OOI.Upperarm_l = n;
    if ( n.name === 'hand_l' ) OOI.hand_l = n;
    if ( n.name === 'target_hand_l' ) OOI.target_hand_l = n;

    if ( n.name === 'boule' ) OOI.sphere = n;
    if ( n.name === 'Kira_Shirt_left' ) OOI.kira = n;
  })

  controls.target.copy( OOI.sphere.position );
  OOI.hand_l.attach( OOI.sphere );

  // 手中的玻璃球
  const cubeRenderTarget = new THREE.WebGLCubeRenderTarget( 1024 );
  mirrorSphereCamera = new THREE.CubeCamera( 0.05, 50, cubeRenderTarget );
  scene.add( mirrorSphereCamera );
  const mirrorSphereMaterial = new THREE.MeshBasicMaterial( { envMap: cubeRenderTarget.texture } );
  OOI.sphere.material = mirrorSphereMaterial;

  // 移动辅助坐标
  transformControls = new TransformControls( camera, renderer.domElement );
  transformControls.size = 0.75;
  transformControls.showX = false;
  // transformControls.space = 'world';
  transformControls.attach( OOI.target_hand_l );
  scene.add( transformControls );
  transformControls.addEventListener( 'mouseDown', () => controls.enabled = false );
	transformControls.addEventListener( 'mouseUp', () => controls.enabled = true );

  OOI.kira.add( OOI.kira.skeleton.bones[ 0 ] );
  const iks = [
    {
      target: 22, // "target_hand_l"
      effector: 6, // "hand_l"
      links: [
        {
          index: 5, // "lowerarm_l"
          rotationMin: new THREE.Vector3( 1.2, - 1.8, - .4 ),
          rotationMax: new THREE.Vector3( 1.7, - 1.1, .3 )
        },
        {
          index: 4, // "Upperarm_l"
          rotationMin: new THREE.Vector3( 0.1, - 0.7, - 1.8 ),
          rotationMax: new THREE.Vector3( 1.1, 0, - 1.4 )
        },
      ],
    }
  ];
  IKSolver = new CCDIKSolver( OOI.kira, iks );
  const ccdikhelper = new CCDIKHelper( OOI.kira, iks, 0.01 );
  scene.add( ccdikhelper );


  function animate() {
    requestAnimationFrame( animate );
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
