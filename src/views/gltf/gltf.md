## 加载模型

注意这里的模型路径，和材质贴图一样会有绝对路径问题

```js
loader.load( new URL('./collision-world.glb', import.meta.url).href, function ( gltf ) {
  console.log('控制台查看加载gltf文件返回的对象结构',gltf);
  console.log('gltf对象场景属性',gltf.scene);
  // 返回的场景对象gltf.scene插入到threejs场景中
  model.add( gltf.scene );
})
```

## 查询加载模型的大小

new THREE.Box3()可以获取模型的包围盒

```js
var boundingBox = new THREE.Box3().setFromObject(gltf.scene)
var size = new THREE.Vector3();
boundingBox.getSize( size );
console.log( "Width: " + size.x + ", Height: " + size.y + ", Depth: " + size.z );
``` 

## 纹理贴图颜色偏差解决

three.js加载gltf模型的时候，可能会遇到three.js渲染结果颜色偏差，对于这种情况，你只需要修改WebGL渲染器默认的编码方式.outputEncoding即可

最新版本属性名字有改变。渲染器属性名.outputEncoding已经变更为.outputColorSpace

```js
renderer.outputEncoding = THREE.sRGBEncoding;
```