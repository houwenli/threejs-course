### 三维坐标系，加强对三维空间的认识

在前面的例子中我们看到不管是设置物体位置还是相机位置，都有x,y,z三个坐标

那么我们是如何确定坐标值的呢，后续如果要做位移又是如何操作如何计算呢，此时就需要有三维空间的概念

new THREE.AxesHelper，辅助观察坐标系

```js
const axesHelper = new THREE.AxesHelper( size );
scene.add( axesHelper );
```

size参数 表示代表轴的线段长度. 默认为 1.就是坐标系的大小

用第一个例子中加上辅助坐标系，就能看到效果，此时可以把材质的透明度开启，更能看清楚坐标轴的起点

```js
const material = new THREE.MeshBasicMaterial( {
  color: 0x0000ff,
  transparent: true, // 是否开启透明
  opacity: 0.5, // 透明度 
} );
```

`红色代表 X 轴. 绿色代表 Y 轴. 蓝色代表 Z 轴.`

自己试着去改变一下物品的位置，以及相机的位置

#### 为什么有的时候会观察不到物品位置，比如
```js
// 物体尺寸
const geometry = new THREE.BoxGeometry( 100, 100, 100 );
// 物体位置
mesh.position.set(0, 0, 0)
// 照相机位置
camera.position.set(0, 0, 0) // 看不到
camera.position.set(0, 0, -50) // 看不到
camera.position.set(0, 0, -51) // 看到了
```
联想一下现实情况，如果相机和物品完全重叠了，要怎么拍照呢

再想想另一种情况，`如果相机不lookAt物体呢，自己试着改变camera.lookAt的参数`，使相机不看向物体

#### 理解一下透视投影相机PerspectiveCamera视锥体的具体范围，比如

```js
// 物体尺寸
const geometry = new THREE.BoxGeometry( 100, 100, 100 );
// 物体位置
mesh.position.set(0, 0, 0)
const camera = new THREE.PerspectiveCamera( 45, canvas.value.clientWidth / canvas.value.clientHeight, 1, 1000 );
// 设置相机的位置
camera.position.set(0, 0, -1051) // 看不到
camera.position.set(0, 0, -1050) // 看到了
```

我们使照相机和物体都在z轴上，照相机的视锥体范围是[1, 1000]，物体尺寸是100，位置是(0, 0, 0)那么z轴最边上的距离就是-50，所以我们的相机只要超过1000(视锥体) + 50(物体尺寸)的距离就看不到物品了






