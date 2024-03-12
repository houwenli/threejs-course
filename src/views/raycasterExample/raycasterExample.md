## webgl像素比
### 渲染器锯齿属性.antialias
```js
const renderer = new THREE.WebGLRenderer({
  antialias:true,
});

// 或者
renderer.antialias = true
```
### 设备像素比
```js
renderer.setPixelRatio(window.devicePixelRatio);
```