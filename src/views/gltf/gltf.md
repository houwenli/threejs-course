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

## 递归遍历方法.traverse()

```js
// 递归遍历所有模型节点批量修改材质
gltf.scene.traverse(function(obj) {
  if (obj.isMesh) {//判断是否是网格模型
      console.log('模型节点',obj);
      console.log('模型节点名字',obj.name);
  }
});
```

## 查看gltf默认的材质

threejs解析gltf模型默认材质一般是MeshStandardMaterial或MeshPhysicalMaterial，相比较其它网格材质，这两个材质属于PBR物理材质，可以提供更加真实的材质效果

## 批量修改gltf所有Mesh的材质

```js
gltf.scene.traverse(function(obj) {
    if (obj.isMesh) {
        // 重新设置材质
        obj.material = new THREE.MeshLambertMaterial({
            color:0xffffff,
        });
    }
});
```

## 材质共享问题

美术通过三维建模软件，比如Blender绘制好一个三维场景以后，一些外观一样的Mesh，可能会共享一个材质对象。

```js
gltf.scene.getObjectByName("小区房子").traverse(function (obj) {
    if (obj.isMesh) {
        // .material.clone()返回一个新材质对象，和原来一样，重新赋值给.material属性
        obj.material = obj.material.clone();
    }
});
```
