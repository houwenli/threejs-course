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

  const material = new THREE.MeshLambertMaterial( {
    color: 0xffffff,
    side: THREE.DoubleSide
  } );

  // 创建射线对象Ray
  const ray = new THREE.Ray()
  // 设置射线起点
  ray.origin = new THREE.Vector3(1, 0, 3)
  // 或者
  // ray.origin.set(1, 0, 3)
  // 射线方向.direction
  // direction值需要是单位向量
  ray.direction = new THREE.Vector3(5, 0, 0).normalize();


  // 看看是否有交叉
  // 举个例子，三角形交叉 intersectTriangle
  const p1 = new THREE.Vector3(100, 25, 0);
  const p2 = new THREE.Vector3(100, -25, 25);
  const p3 = new THREE.Vector3(100, -25, -25);

  // 画出平面
  // const shape = new THREE.Shape([p1, p2, p3]);
  // const geometry = new THREE.ShapeGeometry(shape);

  const geometry = new THREE.BufferGeometry()
  geometry.setFromPoints([p1, p2, p3])

  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)

  const geometry1 = new THREE.BoxGeometry(100, 100, 100)
  const mesh1 = new THREE.Mesh(geometry1, material)
  mesh1.position.set(0, 10, 0)
  scene.add(mesh1)

  const geometry2 = new THREE.SphereGeometry(50)
  const mesh2 = new THREE.Mesh(geometry2, material.clone())
  mesh2.position.set(200, 0, 0)
  scene.add(mesh2)

  // 画出射线
  const raycaster = new THREE.Raycaster();
  // 设置射线起点
  raycaster.ray.origin = new THREE.Vector3(-100, 0, 0);
  // 设置射线方向射线方向沿着x轴
  raycaster.ray.direction = new THREE.Vector3(1, 0, 0);

  // 射线发射拾取模型对象
  const intersects = raycaster.intersectObjects([mesh1, mesh2]);
  console.log("射线器返回的对象", intersects);

  if (intersects.length > 0) {
    // 选中模型的第一个模型，设置为红色
    // intersects[0].object.material.color.set(0xff0000);
  }


  const point = new THREE.Vector3();//用来记录射线和三角形的交叉点
  // `.intersectTriangle()`计算射线和三角形是否相交叉，相交返回交点，不相交返回null
  const result = ray.intersectTriangle(p1,p2,p3,false,point);

  console.log('交叉点坐标', point);
  console.log('查看是否相交', result);


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

  renderer.domElement.addEventListener('click', function(event) {
    console.log(1111, event)
    // 计算点击位置
    // .offsetY、.offsetX以canvas画布左上角为坐标原点,单位px
    const px = event.offsetX;
    const py = event.offsetY;
    //屏幕坐标px、py转WebGL标准设备坐标x、y
    //width、height表示canvas画布宽高度
    const x = (px / canvas.value.clientWidth) * 2 - 1;
    const y = -(py / canvas.value.clientHeight) * 2 + 1;

    //创建一个射线投射器`Raycaster`
    const raycaster = new THREE.Raycaster();
    // 最重要的一个方法setFromCamera
    // 其实就是相机到点击位置的一条射线
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera)

    // 射线发射拾取模型对象
    const intersects = raycaster.intersectObjects([mesh1, mesh2]);
    console.log("射线器返回的对象", intersects);

    if (intersects.length > 0) {
      // 选中模型的第一个模型，设置为红色
      intersects[0].object.material.color.set(0x00ff00);
    }
  })

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
