## 关键帧动画

这个和css中的animation类似

所谓关键帧动画，你可以理解为在时间轴上，选择几个关键的时间点，然后分别定义这几个时间点对应物体状态(比如位置、姿态、颜色等)，然后基于几个关键的时间——状态数据，生成连续的动画。

主要有以下几个步骤

- 给需要设置关键帧动画的模型命名
- 设置关键帧数据KeyframeTrack（此时可以设置多个关键帧数据）
- 基于关键帧数据KeyframeTrack，创建关键帧动画AnimationClip
- 使用播放器AnimationMixer，找到对应的模型或者分组，并且找到相应的帧数据
- 播放过程需要传入时间参数才能展示当前节点的帧画面

核心代码

```js
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
const clip = new THREE.AnimationClip("test", 6, [posKF, colorKF]);
//包含关键帧动画的模型对象作为AnimationMixer的参数创建一个播放器mixer
const mixer = new THREE.AnimationMixer(mesh);
//AnimationMixer的`.clipAction()`返回一个AnimationAction对象
const clipAction = mixer.clipAction(clip); 
//.play()控制动画播放，默认循环播放
clipAction.play(); 
```
播放器播放，注意传入的时间参数是秒，这里的时间借用了THREEjs的Clock对象
```js
// mixer.update()
const clock = new THREE.Clock() // 创建一个时钟对象
function animate() {
  const spt = clock.getDelta()
  // 更新播放器相关的时间
  mixer.update(spt);
  requestAnimationFrame( animate );
}
```

## 动画，停止，播放，暂停/播放，是否循环

### .loop，.clampWhenFinished

通过AnimationAction的循环属性.loop可以控制动画是否循环播放。

```js
//不循环播放，执行一次后默认回到动画开头
clipAction.loop = THREE.LoopOnce; 
```

停止播放后，会回到动画开头，如果想停留在动画结束的位置可以使用clampWhenFinished

```js
// 物体状态停留在动画结束的时候
clipAction.clampWhenFinished = true;
```

停止，播放，暂停/播放

停止（stop）的时候模型会回到开始状态，暂停/播放是属性不是方法

```js
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
```

## 动画播放，可以拖动到任意时间状态

可以把一整段动画截取其中的一部分

AnimationClip参数2设置为6，执行AnimationAction.play()，默认播放0~6秒之间的关键帧动画。AnimationClip参数2的值会作为自身.duration属性的值。

```js
const clip = new THREE.AnimationClip("test", 5, [posKF, colorKF]);
```

也可以手动设置

```js
//AnimationAction设置开始播放时间：从1秒时刻对应动画开始播放
clipAction.time = 1; 
//AnimationClip设置播放结束时间：到5秒时刻对应的动画状态停止
clip.duration = 5;
```

## 解析外部模型关键帧动画

实际开发的时候，很多时候会用三维建模软件，比如Blender，生成关键帧动画，导出包含动画的模型文件，加载模型后,你只需要播放关键帧动画，而不用手写代码创建关键帧动画。

### 关键帧动画模型的父对象作为播放器AnimationMixer参数

### 查看gltf模型动画数据

在三维建模软件中，创建生成动画相关数据，然后可以导出gltf、fbx等可以包含动画的文件，最后程序员通过threejs代码加载模型、解析模型包含的动画数据

加载gltf模型，如果存在帧动画数据的话，可以通过加载返回gltf对象的动画属性.animations获取。

gltf.animations是一个数组，如果没有帧动画数据，就是一个空数组，有帧动画数据的情况下，里面可能1个或多个Clip动画对象`AnimationClip`。

注意这里实际上已经有关键帧数据了，我们后续需要做的就是用帧动画播放器播放我们的帧动画

```js
loader.load(new URL('./model/LittlestTokyo.glb', import.meta.url).href, function (gltf) {
  // 返回的场景对象gltf.scene插入到threejs场景中
  model.add( gltf.scene );
  console.log(1111, gltf)

  //包含帧动画的模型作为参数创建一个播放器
  mixer = new THREE.AnimationMixer(gltf.scene);
  //  获取gltf.animations[0]的第一个clip动画对象
  const clipAction = mixer.clipAction(gltf.animations[0]);//创建动画clipAction对象
  clipAction.play();//播放动画
})

// 创建一个时钟对象Clock
const clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  if (mixer !== null) {
    //clock.getDelta()方法获得两帧的时间间隔
    // 更新播放器相关的时间
    mixer.update(clock.getDelta());
  }
}
 render();

```

## 变形动画原理

### .morphAttributes设置几何体变形目标顶点数据

BufferGeometry属性.morphAttributes的功能就是用来设置几何体变形目标顶点数据。

```js
// 添加一个长方体
const geometry1 = new THREE.BoxGeometry( 100, 100, 100 );

// 为geometry提供变形目标的顶点数据(注意和原始geometry顶点数量一致)
const target1 = new THREE.BoxGeometry(100, 200, 100).attributes.position;//变高
const target2 = new THREE.BoxGeometry(20, 100, 20).attributes.position;//变细

geometry1.morphAttributes.position = [target1, target2];

const mesh1 = new THREE.Mesh(geometry1, material);
```

### .morphTargetInfluences权重系数控制变形程度

设置变形目标影响权重，范围一般0~1。其实就是变形的幅度

```js
//权重0：初始态
mesh.morphTargetInfluences[0] = 0.0;
//权重1：物体形状对应target1表示形状
mesh.morphTargetInfluences[0] = 1.0;
//权重0.5：物体形状对应geometry和target1变形中间状态
mesh.morphTargetInfluences[0] = 0.5;
```

### 多个变形目标综合影响模型形状

一个网格模型的几何体geometry可以有多个变形目标，只要对应权重不为0，每个变形目标的形状都会影响模型的形状。

### 开始变形

```js
mesh1.name = "Box1"
const KF1 = new THREE.KeyframeTrack('Box1.morphTargetInfluences[0]', [0, 5], [0, 1]);
const KF2 = new THREE.KeyframeTrack('Box1.morphTargetInfluences[1]', [0, 5], [0, 1]);
const clip1 = new THREE.AnimationClip("t", 5, [KF1, KF2]);
// 播放变形动画
const mixer1 = new THREE.AnimationMixer(mesh1);
const clipAction1 = mixer1.clipAction(clip1);
clipAction1.play();

// 创建一个时钟对象Clock
const clock = new THREE.Clock();
function render() {
  requestAnimationFrame(render);
  if (mixer1 !== null) {
    //clock.getDelta()方法获得两帧的时间间隔
    // 更新播放器相关的时间
    mixer1.update(clock.getDelta());
  }
}
 render();
```
