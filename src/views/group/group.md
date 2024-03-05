## 组（group）

之前有学过gui，这个其实和gui分组其实比较类似

开发中可能有这么一个场景，某一些元素组合起来需要在不同位置复用，那么如果不分组，代码组织就会比较困难，另外也不太方便复用

类似于vue的组件化开发

### 递归遍历方法.traverse()

Threejs层级模型就是一个树结构，可以通过递归遍历的算法去遍历Threejs一个模型对象包含的所有后代

```js
floor.traverse((item) => {
  console.log('模型节点名称', item.name)

  if (item.isMesh) {//判断条件也可以是obj.type === 'Mesh'
    item.material.color.set(0xffff00);
  }
})
```

### 查找某个具体的模型.getObjectByName()

```js
const floor3 = scene.getObjectByName('3号楼')
floor3.material = new THREE.MeshLambertMaterial( {} );
floor3.material.color.set(0x136789)
```

## 本地局部坐标和世界坐标

从前面的例子可以看出，除了模型可以设置position，我们的分组也是可以设置position的

那么我们可以得出一个结论

- 局部坐标 模型的.position属性
- 世界坐标 值得是在整个空间中的位置，也就是说是模型自身.position和所有父对象.position累加的坐标。

### .getWorldPosition()获取世界坐标

如果你想要获取一个模型的世界坐标，这个模型存在的分组也设置了position，要怎么处理呢，

试试看，理解一下getWorldPosition()和position

```js
const floor6 = scene.getObjectByName('6号楼')
floor6.material = new THREE.MeshLambertMaterial( {} );
floor6.material.color.set(0x136789)

const worldPosition = new THREE.Vector3();
console.log(2222, floor6.getWorldPosition(worldPosition), floor6.position)
```

## 添加局部辅助坐标系

```js
// 添加局部辅助坐标系
const axesHelper = new THREE.AxesHelper(100);
floor.add( axesHelper );
```
