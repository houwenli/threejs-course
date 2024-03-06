import * as THREE from 'three';
//创建一个空的几何体对象
const geometry = new THREE.BufferGeometry();

//类型化数组创建顶点数据
const vertices = new Float32Array([
  0, 0, 0, //顶点1坐标
  0, 80, 0, //顶点2坐标
  80, 0, 0, //顶点3坐标
  80, 0, 0, //顶点4坐标
  80, 80, 0, //顶点5坐标
  0, 80, 0, //顶点6坐标
]);

const attribue = new THREE.BufferAttribute(vertices, 3);

geometry.attributes.position = attribue;

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  // side: THREE.DoubleSide
}); 

const rectangle = new THREE.Mesh(geometry, material);

export default rectangle