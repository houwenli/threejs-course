# object3d

点模型Points、线模型Line、网格网格模型Mesh等模型对象的父类都是Object3D

`一定要区分开，模型和几何体的区别，模型是由几何体构成的`

## 三维向量Vector3

三维向量Vector3有xyz三个分量，threejs中会用三维向量Vector3表示很多种数据

打印mesh.position，你会发现其实是一个Vector3数据

那么我们可以直接设置mesh.position为一个Vector3数据么

`会报错的，mesh.position是一个只读属性，不可以设置`

```js
const v3 = new THREE.Vector3(0,0,0);
v3.set(10,0,0);//set方法设置向量的值

// 不可以设置
mesh.position = v3
```

### 模型方法

既然是模型，那么肯定也会有平移，缩放，旋转，改变位置等方法，注意理解一下几何体为什么没有改变位置的方法

#### 平移

执行.translateX()、.translateY()等方法本质上改变的都是模型的位置属性.position

```js
mesh.translateX(100)
```

直接像某一个方向平移translateOnAxis，第一个参数转换为标准向量，就是说长度为1，这个只为了控制移动距离，比如在一个空间中需要像某一个方向移动固定距离，控制x,y,z将会很复杂

```js
const v = new THREE.Vector3(1, 1, 1)
v.normalize()
mesh.translateOnAxis(v, 200)
```


#### 缩放

属性.scale表示模型对象的xyz三个方向上的缩放比例，.scale的属性值是一个三维向量对象Vector3,默认值是THREE.Vector3(1.0,1.0,1.0)。

```js
mesh.scale.x = 2.0;
```

#### 改变位置

```js
mesh.position.set(80,2,10);
mesh.position.y = 200;
```

## 欧拉角Euler

这个看的很高大上，其实就是描述一个旋转变换，通过指定轴顺序和其各个轴向上的指定旋转角度来旋转一个物体

Math.PI就是旋转180度

```js
const Euler = new THREE.Euler( Math.PI/4,0, Math.PI/2);

// 或者
Euler.x = Math.PI/4;
Euler.y = Math.PI/2;
Euler.z = Math.PI/4;

```

### 模型旋转

模型旋转其实就是改变模型的rotation

```js
mesh.rotateX(Math.PI/4,0)
mesh.rotateY(Math.PI/4,0)

// 或者
mesh.rotation.y = Math.PI/4,0
mesh.rotation.set(Math.PI/4,0, Math.PI/4)

// 或者
const euler = new THREE.Euler( Math.PI/4,0, Math.PI/2);
mesh.setRotationFromEuler(euler)
```

## Color对象

- .r : Float
红色通道的值在0到1之间。默认值为1。

- .g : Float
绿色通道的值在0到1之间。默认值为1。

- .b : Float
蓝色通道的值在0到1之间。默认值为1。

```js
const color1 = new THREE.Color();

//Hexadecimal color (recommended)
const color2 = new THREE.Color( 0xff0000 );

//RGB string
const color3 = new THREE.Color("rgb(255, 0, 0)");
const color4 = new THREE.Color("rgb(100%, 0%, 0%)");

//X11 color name - all 140 color names are supported.
//Note the lack of CamelCase in the name
const color5 = new THREE.Color( 'skyblue' );

//HSL string
const color6 = new THREE.Color("hsl(0, 100%, 50%)");
```

### setRGB,setHex,set,setStyle

```js
const color = new THREE.Color();
color.setRGB(1, 0, 1)
color.setHex(0xff0000)
color.setStyle('#ff0000')

// 通用的
color.set()
```

## 改变模型相对局部坐标原点的位置

默认情况下，模型的坐标原点是自己的position

如果我们改变几何体的位置就能实现模型的坐标原点不是自己的position

让模型动起来

```js
const geometry1 = new THREE.BoxGeometry( 100, 100, 100, 1, 2, 2 );
geometry1.translate(-50, 0, 0)
const mesh1 = new THREE.Mesh(geometry1, material)
// 可以设置物体的位置
mesh1.position.set(0, 0, 0)
scene.add( mesh1 );

mesh1.rotateY(0.01)
```

## 移除对象.remove()

移除，不只是删除模型。光源等等都能删除

另外不止可以从场景中删除，也能从group（组对象）中移除




