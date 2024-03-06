## 创建纹理贴图

通过纹理贴图加载器TextureLoader的load()方法加载一张图片可以返回一个纹理对象Texture，纹理对象Texture可以作为模型材质颜色贴图.map属性的值。

```js
const geometry = new THREE.PlaneGeometry(200, 100); 
// 纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();

const texture = texLoader.load(new URL('./earth.jpg', import.meta.url).href);

// console.log(texture)
const material = new THREE.MeshLambertMaterial({
  // 设置纹理贴图：Texture对象作为材质map属性的属性值
  map: texture, // map表示材质的颜色贴图属性
});

const mesh = new THREE.Mesh(geometry, material)
scene.add( mesh );
```

### 图片路径问题

这里注意一个很重要的点

texLoader.load是一个异步方法，并不会立即执行load文件，如果是相对路径load方法会转变成绝对路径也就是http://localhost:5173/earth.jpg，此时是找不到的

所以我们需要转变为绝对路径

在vite中可以使用下面的方式

```js
new URL('./earth.jpg', import.meta.url).href
```

## 自定义顶点UV

顶点数据生成几何体的时候你会发现如果没有设置顶点uv，贴图不会生效,，具体可以看rectangle中，不设置uv的情况

顶点UV坐标geometry.attributes.uv和顶点位置坐标geometry.attributes.position是一一对应的

UV顶点坐标你可以根据需要在0~1之间任意设置，具体怎么设置，要看你想把图片的哪部分映射到Mesh的几何体表面上。

```js
/**纹理坐标0~1之间随意定义*/
const uvs = new Float32Array([
    0, 0, //图片左下角
    1, 0, //图片右下角
    1, 1, //图片右上角
    0, 1, //图片左上角
]);
// 设置几何体attributes属性的位置normal属性
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2);
```

### 获取纹理贴图四分之一

```js
const uvs = new Float32Array([
    0, 0, 
    0.5, 0, 
    0.5, 0.5, 
    0, 0.5, 
]);
```

## 圆形平面设置纹理贴图

可以通过圆形几何体CircleGeometry创建一个网格模型Mesh，把一张图片作为圆形Mesh材质的颜色贴图，这样就可以把一张方形图片剪裁渲染为圆形效果。

这里要注意

`如果我们的贴图不是一个正方形，那么圆形平面上的图片就会变形`

CircleGeometry的UV坐标会对颜色纹理贴图.map进行提取，CircleGeometry的UV坐标默认提取的就是一个圆形轮廓。

## 纹理对象Texture阵列

- 先创建一个比较大的地面
- 设置一个贴图
- 设置阵列模式，两个方向，阵列多少个

```js
const tileGeometry = new THREE.PlaneGeometry(2000, 2000);
// .load()方法加载图像，返回一个纹理对象Texture
const tileTexture = texLoader.load(new URL('./tile.png', import.meta.url).href);
// 设置阵列模式
tileTexture.wrapS = THREE.RepeatWrapping;
tileTexture.wrapT = THREE.RepeatWrapping;
tileTexture.repeat.set(12,12)
const tileMaterial = new THREE.MeshLambertMaterial({
    // 设置纹理贴图：Texture对象作为材质map属性的属性值
    map: tileTexture,//map表示材质的颜色贴图属性
});
const tileMesh = new THREE.Mesh(tileGeometry, tileMaterial);
```

## 矩形Mesh+背景透明png贴图

透明png贴图，需要给材质加上属性`transparent: true`

## UV动画

### 纹理对象.offset属性

纹理对象Texture的.offset的功能是偏移贴图在Mesh上位置，本质上相当于修改了UV顶点坐标。

### 纹理贴图阵列 + UV动画

当设置阵列的时候，就会循环在我们的几何体上渲染
