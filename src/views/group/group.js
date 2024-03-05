import * as THREE from 'three'

// 添加一个长方体
const geometry = new THREE.BoxGeometry( 100, 100, 100, 1, 2, 2 );
// geometry.scale(2, 2, 2)
geometry.translate(-50, 50, 50)
// geometry.rotateX(Math.PI / 4)
geometry.center()

const material = new THREE.MeshLambertMaterial( {
  // color: 0x0000ff,
  transparent: true, // 是否开启透明
  opacity: 0.8, // 透明度 
  side: THREE.DoubleSide
  // wireframe:true,//线条模式渲染mesh对应的三角形数据
} );

const mesh = new THREE.Mesh(geometry, material)

const mesh1 = mesh.clone(mesh)
mesh1.position.set(150, 0, 0)

const group = new THREE.Group()

group.add(mesh)
group.add(mesh1)

export default group



