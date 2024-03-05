import * as THREE from 'three'

// 批量创建高楼层
const group = new THREE.Group()
group.name = '高楼层'
const geometry = new THREE.BoxGeometry( 10, 100, 10, 1, 2, 2 );
const material = new THREE.MeshLambertMaterial( {
  color: 0x0000ff,
  transparent: true, // 是否开启透明
  opacity: 0.8, // 透明度 
  side: THREE.DoubleSide
  // wireframe:true,//线条模式渲染mesh对应的三角形数据
} );

for (let i = 0; i < 5; i++) {
  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(i * 30, 50, 0)
  mesh.name = i + 1 + '号楼';
  group.add(mesh)
}

const group1 = new THREE.Group()
group1.name = '底楼层'
const geometry1 = new THREE.BoxGeometry( 10, 50, 10, 1, 2, 2 );
const material1 = new THREE.MeshLambertMaterial( {
  // color: 0x0000ff,
  transparent: true, // 是否开启透明
  opacity: 0.8, // 透明度 
  side: THREE.DoubleSide
  // wireframe:true,//线条模式渲染mesh对应的三角形数据
} );

for (let i = 0; i < 5; i++) {
  const mesh = new THREE.Mesh(geometry1, material1)
  mesh.position.set(i * 30, 25, 0)
  mesh.name = i + 6 + '号楼';
  group1.add(mesh)
}

group1.position.z = 50
 
const floor = new THREE.Group()
floor.add(group)
floor.add(group1)

// 添加局部辅助坐标系
const axesHelper = new THREE.AxesHelper(150);
floor.add( axesHelper );


export default floor



