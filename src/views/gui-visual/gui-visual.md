## gui结合threejs

### gui的不同方法

#### .name()
gui默认会取我们设置的属性名当做属性的title，但是如果多个属性名都是一样的呢，或者属性名的含义模糊呢

为了通过交互界面更好理解你改变的某个对象属性，你可以通过.name()方法改变gui生成交互界面显示的内容
```js
 // threejs中的物品都是通过网格表示的
// mesh需要形状和外观
const mesh = new THREE.Mesh(geometry, material)
// 可以设置物体的位置
mesh.position.set(0, 0, 0)
// 添加gui，控制物体位置
gui.add(mesh.position, 'x', -200, 200)
gui.add(mesh.position, 'y', 0, 200)
gui.add(mesh.position, 'z', 0, 200)
// 在场景中添加物品
scene.add( mesh );


const mesh1 = new THREE.Mesh(geometry, material)
// 可以设置物体的位置
mesh1.position.set(-200, 0, 0)
// 添加gui，控制物体位置
gui.add(mesh1.position, 'x', -200, 200).name('mesh1 x坐标')
gui.add(mesh1.position, 'y', 0, 200).name('mesh1 y坐标')
gui.add(mesh1.position, 'z', 0, 200).name('mesh1 z坐标')

scene.add( mesh1 );
```

#### .step()步长
```js
// 接上面的例子
gui.add(mesh1.position, 'x', -200, 200).name('mesh1 x坐标').step(10)
```

#### .onChange()
当gui界面某个值的时候，.onChange()方法就会执行，这时候你可以根据需要通过.onChange()执行某些代码。
```js
// 继续接上面的例子
gui.add(mesh1.position, 'z', 0, 200).name('mesh1 z坐标').step(10).onChange(() => {
  console.log(mesh1.position)
})
```

#### .addColor()颜色值改变
```js
const colorObj = {
  color: 0x00ffff
}

gui.addColor(colorObj, 'color').onChange(() => {
  mesh.material.color.set(colorObj.color);
})
```

#### 下拉菜单
.add()方法第三个参数是一个数组时，可以看看效果
```js
gui.add(mesh.position, 'x', [-200, 0, 200])
```

第三个参数还能是一个对象
```js
gui.add(mesh.position, 'y', {
  left: -200,
  middle: 0,
  right: 200
})
```

#### 单选框
如果.add()改变属性的对应的数据类型如果是布尔值，那么交互界面就是一个单选框。

```js
const obj = {
    bool: false,
};
// 改变的obj属性数据类型是布尔值，交互界面是单选框
gui.add(obj, 'bool').name('是否旋转');
```

#### gui分组.addFolder()
实际开发中我们会有海量的设置条件，此时就需要我们对设置进行分组，整合我们的设置

new GUI()默认会创建一个总的菜单，然后返回的对象有add，addColor等一系列的方法

addFolder会创建一个子菜单，该方法返回的对象同样有add，addColor这些方法

另外子菜单还能嵌套子菜单

此外还有close，和open方法设置默认展开还是关闭

```js
const meshFolder = gui.addFolder('mesh')
meshFolder.close()
// 添加gui，控制物体位置
meshFolder.add(mesh.position, 'x', [-200, 0, 200])
meshFolder.add(mesh.position, 'y', {
  left: -200,
  middle: 0,
  right: 200
})
meshFolder.add(mesh.position, 'z', 0, 200)

const colorObj = {
  color: 0x00ffff
}

meshFolder.addColor(colorObj, 'color').onChange(() => {
  mesh.material.color.set(colorObj.color);
})
```