### 相机轨道控制器

平时开发调试代码，或者展示模型的时候，可以通过相机控件OrbitControls实现旋转缩放预览效果

核心代码
```js
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const controls = new OrbitControls( camera, renderer.domElement );

controls.addEventListener('change', function() {
  renderer.render( scene, camera );
  console.log(camera.position)
})

// 或者使用下面的方式，借用requestAnimationFrame完成每一帧的渲染
// 注意这里，控制器任何的改动都需要渲染器重新渲染
function animate() {

  requestAnimationFrame( animate );

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render( scene, camera );

}
animate()
```
#### 使用clock时钟对象，观察渲染帧率
```js
const clock = new THREE.Clock() // 创建一个时钟对象 
const spt = clock.getDelta() * 1000
console.log('spt', spt)
```


#### 注意一些参数
- autoRotate 是否自动旋转
- autoRotateSpeed 旋转速度，默认值2.0
- enableDamping 设置是否启用阻尼
- dampingFactor 阻尼惯性， 默认0.05


`OrbitControls本质上改变的是相机的位置`，所以每次我们改变了相机的位置就需要渲染器重新渲染

#### canvas画布布局遇全屏
创建渲染器的时候有个方法，我们可以看到可以自定义渲染器的宽高。我们只需要获取屏幕宽高设置进去就可以实现全屏。
```js
const renderer = new THREE.WebGLRenderer();
renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
```
但是有个问题，如果我们改变屏幕尺寸会发生什么呢。渲染器是没有变化的，此时可以借助浏览器的onresize方法进行调整

```js
window.onresize = function() {
  // 重置渲染器的尺寸
  renderer.setSize(canvas.value.clientWidth, canvas.value.clientHeight)
  
  // 设置相机的宽高比
  camera.aspect = canvas.value.clientWidth / canvas.value.clientHeight

  // 渲染器执行render方法的时候会读取相机对象的投影矩阵属性projectionMatrix
  // 但是不会每渲染一帧就通过相机的属性计算投影矩阵
  // 如果相机的一些属性发生了变化,需要执行updateProjectionMatrix
  camera.updateProjectionMatrix()

}
```

#### 渲染帧率
使用stats工具
```js
// 引入stats性能监视器
import Stats from 'three/examples/jsm/libs/stats.module.js'
// 添加渲染帧率
const stats = new Stats()
document.querySelector('.el-main').appendChild(stats.domElement)
stats.update()
```

