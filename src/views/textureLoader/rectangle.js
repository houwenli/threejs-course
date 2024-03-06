import * as THREE from 'three';
//创建一个空的几何体对象
const geometry = new THREE.BufferGeometry();

//类型化数组创建顶点数据
const vertices = new Float32Array([
  0, 0, 0, //顶点1坐标
  200, 0, 0, //顶点2坐标
  200, 100, 0, //顶点5坐标
  0, 100, 0, //顶点6坐标
]);

const attribue = new THREE.BufferAttribute(vertices, 3);

geometry.attributes.position = attribue;

const indexes = new Uint16Array([
  // 下面索引值对应顶点位置数据中的顶点坐标
  0, 1, 2, 0, 2, 3,
])

geometry.index = new THREE.BufferAttribute(indexes, 1);

const uvs = new Float32Array([
  0, 0, //图片左下角
  1, 0, //图片右下角
  1, 1, //图片右上角
  0, 1, //图片左上角
]);
// 设置几何体attributes属性的位置normal属性
geometry.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标

// 纹理贴图加载器TextureLoader
const texLoader = new THREE.TextureLoader();

const texture = texLoader.load(new URL('./earth.jpg', import.meta.url).href);
const material = new THREE.MeshBasicMaterial({
  map: texture,
}); 

const rectangle = new THREE.Mesh(geometry, material);

export default rectangle