### 光源
实际生活中物体表面的明暗效果是会受到光照的影响，比如晚上不开灯，你就看不到物体，灯光比较暗，物体也比较暗。在threejs中，咱们用网格模型Mesh模拟生活中物体，所以threejs中模拟光照Light对物体表面的影响，就是模拟光照Light对网格模型Mesh表面的影响。

### 材质
材质中区分受光照影响和不受光照影响

不受光照影响
- 基础材质 MeshBasicMaterial 

受光照影响
- Lambert网格材质(MeshLambertMaterial) 
- Phong网格材质(MeshPhongMaterial)

等等。。

### 光源划分

- AmbientLight 环境光
- PointLight 点光源
- SpotLight 聚光灯
- DirectionalLight 平行光

以点光源为例

```js
PointLight( color : Color, intensity : Float, distance : Number, decay : Float )
color -（可选）一个表示颜色的 Color 的实例、字符串或数字，默认为一个白色（0xffffff）的 Color 对象。
intensity -（可选）光照强度。默认值为 1。
distance - 光源照射的最大距离。默认值为 0（无限远）。
decay - 沿着光照距离的衰退量。默认值为 2
```

使用示例
```js
const light = new THREE.PointLight( 0xff0000, 1, 100 );
light.position.set( 50, 50, 50 );
scene.add( light );
```

可以改变光源位置查看效果，注意看不同面的光照，如果光源在物体内部就不会有光照
```js
light.position.set( 100, 0, 0 );
light.position.set( 100, 100, 0 );
light.position.set( 100, 100, 100);
```

试着添加多点光源
```js
// 添加点光源
const light = new THREE.PointLight( 0x0000ff, 1, 1000, 0 );
light.position.set( 0, 0, 100);
scene.add( light );

const light1 = new THREE.PointLight( 0x00ff00, 1, 1000, 0 );
light1.position.set( 100, 0, 0);
scene.add( light1 );

const light2 = new THREE.PointLight( 0xff0000, 1, 1000, 0 );
light2.position.set( 0, 100, 0);
scene.add( light2 );
```

### 添加点光源辅助观察

```js
const sphereSize = 2;
const pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
scene.add( pointLightHelper );
```
语法规则
```js
PointLightHelper( light : PointLight, sphereSize : Float, color : Hex )
light -- 要模拟的光源.

sphereSize -- (可选的) 球形辅助对象的尺寸. 默认为 1.

color -- (可选的) 如果没有赋值辅助对象将使用光源的颜色.
```

### 其他光源
#### 环境光
没有光源位置，物体所有位置都能被光源照到
```js
const light1 = new THREE.AmbientLight( 0x404040, 1 ); // 柔和的白光
scene.add( light1 )
```
#### 平行光
平行光意味着它的方向是从一个位置 position 到 target 的位置。 （而不是一个只有旋转分量的“自由平行光”）

如果target不设置默认指向坐标原点(0, 0, 0)
```js
const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
directionalLight.position.set( 100, 100, 100);
// target不设置，默认就是坐标原点
directionalLight.target = mesh;
scene.add( directionalLight );
```
#### 平行光辅助器
```js
const directionalLightHelper = new THREE.DirectionalLightHelper( directionalLight, 10 );
scene.add( directionalLightHelper );
```

#### 聚光源SpotLight

```js
const spotLight = new THREE.SpotLight(0xffffff,1.0);
spotLight.position.set(-100, 100, -100)
spotLight.target = mesh
spotLight.angle = Math.PI / 6;
scene.add(spotLight);//光源添加到场景中
// 聚光源辅助对象，可视化聚光源
const spotLightHelper = new THREE.SpotLightHelper(spotLight,0xffffff)
scene.add(spotLightHelper);
```

### 阴影效果
以平行光为例，其他光源类似设置，平行光DirectionalLight阴影计算最少设置

- castShadow设置产生阴影的模型对象
- castShadow设置产生阴影的光源对象
- receiveShadow设置接收阴影效果的模型
- shadowMap.enabledWebGl渲染器允许阴影渲染
- shadow.camera设置光源阴影渲染范围


