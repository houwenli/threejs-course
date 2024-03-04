### camera
```js
// 透视投影相机
const camera = new THREE.PerspectiveCamera( 45, canvas.value.clientWidth / canvas.value.clientHeight, 1, 10000 );
// 设置相机的位置
camera.position.set(200, 200, 200)
// 设置相机拍照的视线方向
camera.lookAt(1000, 0, 1000)
```

#### 需要注意OrbitControls
相机控件OrbitControls会影响相机lookat的设置,需要手动设置OrbitControls的目标参数

加上相机控件之后你会发现相机的lookAt设置不生效了,默认观察点是(0, 0, 0)
```js
const controls = new OrbitControls( camera, renderer.domElement );
controls.target.set(1000, 0 , 1000)
```
#### 远小近大
符合人体视觉
  