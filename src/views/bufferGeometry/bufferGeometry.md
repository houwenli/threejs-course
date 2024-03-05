## 查看几何体顶点位置和索引数据

threejs默认的大部分几何体都有三角形的顶点索引数据，具体可以通过浏览器控制台打印几何体数据查看。

```js
// 添加一个长方体
const geometry = new THREE.BoxGeometry( 100, 100, 100, 1, 2, 2 );

console.log('几何体',geometry);
console.log('顶点位置数据',geometry.attributes.position);
console.log('顶点索引数据',geometry.index);
```

## 材质属性.wireframe

线条模式渲染，查看几何体三角形结构

```js
const material = new THREE.MeshLambertMaterial({
    color: 0x00ffff, 
    wireframe:true,//线条模式渲染mesh对应的三角形数据
});
```

## 几何体细分数

```js
// 矩形几何体PlaneGeometry的参数3,4表示细分数，默认是1,1
const geometry = new THREE.PlaneGeometry(100, 50, 1, 1);

// 添加一个长方体 默认1，1，1
const geometry = new THREE.BoxGeometry( 100, 100, 100, 1, 2, 2 );
```

## 球体SphereGeometry细分数

球体SphereGeometry参数2、3分别代表宽、高度两个方向上的细分数，默认32,16

```js
const geometry = new THREE.SphereGeometry( 50, 32, 16 )

// 如果球体细分数比较低，表面就不会那么光滑
const geometry = new THREE.SphereGeometry( 50, 8, 8)
```

## 注意

`几何体三角形数量或者说顶点数量直接影响Three.js的渲染性能，在不影响渲染效果的情况下，一般尽量越少越好。`


## BufferGeometry通过.scale()、.translate()、.rotateX()、.rotateY()等方法可以对几何体本身进行缩放、平移、旋转,这些方法本质上都是改变几何体的顶点数据。

```js
geometry.scale(2, 2, 2);
// 几何体沿着x轴平移50
geometry.translate(50, 0, 0);
// 几何体绕着x轴旋转45度
geometry.rotateX(Math.PI / 4);
// 居中
geometry.center()
```