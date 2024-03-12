## PBR材质简介

Three.js提供了两个PBR材质相关的APIMeshStandardMaterial和MeshPhysicalMaterial,MeshPhysicalMaterial是MeshStandardMaterial扩展的子类，提供了更多功能属性

## PBR材质金属度和粗糙度

### 金属度metalness

金属度属性.metalness表示材质像金属的程度, 非金属材料,如木材或石材,使用0.0,金属使用1.0。

threejs的PBR材质，.metalness默认是0.5,0.0到1.0之间的值可用于生锈的金属外观

```js
new THREE.MeshStandardMaterial({
    metalness: 1.0,//金属度属性
})
```

### 粗糙度roughness

粗糙度roughness表示模型表面的光滑或者说粗糙程度，越光滑镜面反射能力越强，越粗糙，表面镜面反射能力越弱，更多地表现为漫反射。

粗糙度roughness,0.0表示平滑的镜面反射,1.0表示完全漫反射,默认0.5。

```js
new THREE.MeshStandardMaterial({
    roughness: 0.5,//表面粗糙度
})
```

## 环境贴图.envMap

环境贴图对PBR材质渲染效果影响还是比较大，一般渲染PBR材质的模型，最好设置一个合适的环境贴图。

### 立方体纹理加载器CubeTextureLoader

纹理贴图加载器TextureLoader的.load()方法加载一张图片可以返回一个纹理对象Texture。

立方体纹理加载器CubeTextureLoader的.load()方法是加载6张图片，返回一个立方体纹理对象CubeTexture。

立方体纹理对象CubeTexture的父类是纹理对象Texture。

```js
// 加载环境贴图
// 加载周围环境6个方向贴图
// 上下左右前后6张贴图构成一个立方体空间
// 'px.jpg', 'nx.jpg'：x轴正方向、负方向贴图  p:正positive  n:负negative
// 'py.jpg', 'ny.jpg'：y轴贴图
// 'pz.jpg', 'nz.jpg'：z轴贴图
const textureCube = new THREE.CubeTextureLoader()
  .setPath(`${new URL('./env', import.meta.url).pathname}/`)
  .load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
```

### 环境贴图属性.envMap

```js
new THREE.MeshStandardMaterial({
  metalness: 1.0,//金属度属性
  roughness: 0.8,//表面粗糙度
  side: THREE.DoubleSide,
  envMap: textureCube
})
```

### 环境贴图反射率

.envMapIntensity属性主要用来设置模型表面反射周围环境贴图的能力，或者说环境贴图对模型表面的影响能力。具体说.envMapIntensity相当于环境贴图的系数，环境贴图像素值乘以该系数后，在用于影响模型表面。

## MeshPhysicalMaterial清漆层

MeshPhysicalMaterial和MeshStandardMaterial都是拥有金属度metalness、粗糙度roughness属性的PBR材质，MeshPhysicalMaterial是在MeshStandardMaterial基础上扩展出来的子类，除了继承了MeshStandardMaterial的金属度、粗糙度等属性，还新增了清漆.clearcoat、透光率.transmission、反射率.reflectivity、光泽.sheen、折射率.ior等等各种用于模拟生活中不同材质的属性。

### 清漆层属性.clearcoat

清漆层属性.clearcoat可以用来模拟物体表面一层透明图层，就好比你在物体表面刷了一层透明清漆，喷了点水。.clearcoat的范围0到1，默认0。

```js
const material = new THREE.MeshPhysicalMaterial( {
	clearcoat: 1.0,//物体表面清漆层或者说透明涂层的厚度
} );
```

### 清漆层粗糙度.clearcoatRoughness

清漆层粗糙度.clearcoatRoughness属性表示物体表面透明涂层.clearcoat对应的的粗糙度，.clearcoatRoughness的范围是为0.0至1.0。默认值为0.0。

```js
const material = new THREE.MeshPhysicalMaterial( {
	clearcoat: 1.0,//物体表面清漆层或者说透明涂层的厚度
	clearcoatRoughness: 0.1,//透明涂层表面的粗糙度
} );
```

## 物理材质透光率.transmission

为了更好的模拟玻璃、半透明塑料一类的视觉效果，可以使用物理透明度.transmission属性代替Mesh普通透明度属性.opacity。

```js
mesh.material = new THREE.MeshPhysicalMaterial({
    transmission: 1.0, //玻璃材质透光率，transmission替代opacity 
})
```

### 折射率.ior

非金属材料的折射率从1.0到2.333。默认值为1.5。

```js
new THREE.MeshPhysicalMaterial({
    ior:1.5,//折射率
})
```

## 环境贴图的映射模式

- THREE.CubeReflectionMapping：该映射模式将环境贴图作为一个立方体贴图，将六个面分别映射到对应的立方体面上，以模拟立方体环境映射和反射效果。
- THREE.CubeRefractionMapping：该映射模式与 THREE.CubeReflectionMapping 类似，但是它模拟的是折射效果，即将环境贴图中的物体看作透明的，经过物体的折射后反射到表面上。
- THREE.EquirectangularReflectionMapping：该映射模式将环境贴图作为一个全景图片，将图片映射到球体或半球体上，以模拟球形环境映射和反射效果。
- THREE.EquirectangularRefractionMapping：该映射模式与 THREE.EquirectangularReflectionMapping 类似，但是模拟的是折射效果，即将环境贴图中的物体看作透明的，经过物体的折射后反射到表面上。
- THREE.SphericalReflectionMapping：该映射模式将环境贴图映射到一个球形贴图上，以模拟球形环境映射和反射效果。与 THREE.EquirectangularReflectionMapping 相比，该映射模式需要使用一个球形贴图，因此对图像质量的要求较高，但可以实现更加真实的球形反射效果。
