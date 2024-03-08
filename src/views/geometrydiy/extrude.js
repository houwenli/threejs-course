// 拉伸
// 使用拉伸扫描ExtrudeGeometry和轮廓填充ShapeGeometry一样，需要首先定义一个用于拉伸或扫描的平面轮廓Shape。

import * as THREE from 'three'

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  // side:THREE.DoubleSide,//双面显示看到管道内壁
  // wireframe:true,
})

// 一组二维向量表示一个多边形轮廓坐标
// const pointsArr = [
//   new THREE.Vector2(-50, -50), //多边形起点
//   new THREE.Vector2(-50, 50),
//   new THREE.Vector2(50, 50),
//   new THREE.Vector2(50, -50),
// ]

const pointsArr = [
  // 按照特定顺序，依次书写多边形顶点坐标
  new THREE.Vector2(0,0), //多边形起点
  new THREE.Vector2(0,10),
  new THREE.Vector2(10,10),
  new THREE.Vector2(10,0),
]

// Shape表示一个平面多边形轮廓,参数是二维向量构成的数组pointsArr
const shape = new THREE.Shape(pointsArr);


// 扫描轨迹：创建轮廓的扫描轨迹(3D样条曲线)
const curve = new THREE.CatmullRomCurve3([
  new THREE.Vector3( -10, -50, -50 ),
  new THREE.Vector3( 10, 0, 0 ),
  new THREE.Vector3( 8, 50, 50 ),
  new THREE.Vector3( -5, 0, 100)
]);

const geometry = new THREE.ExtrudeGeometry(shape, {
  extrudePath: curve,
  steps:100//沿着路径细分精度，越大越光滑
  // depth: 20, //拉伸长度
  // bevelThickness: 10, //倒角尺寸:拉伸方向
  // bevelSize: 5, //倒角尺寸:垂直拉伸方向
  // bevelSegments: 20, //倒圆角：倒角细分精度，默认3
});


// line最后一个点不会闭合，可以使用LineLoop
// const model = new THREE.Line(geometry, material);
const model = new THREE.Mesh(geometry, material);

model.position.x = 200
model.position.z = 0

export default model