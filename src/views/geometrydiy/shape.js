// 不规则的曲线
// 样条曲线和贝塞尔曲线

// 椭圆
// 可以想象一下，圆弧上的点的坐标是和sin。cos相关的

import * as THREE from 'three'

const material = new THREE.LineBasicMaterial({
  color: 0xff0000,
  // side:THREE.DoubleSide,//双面显示看到管道内壁
  wireframe:true,
})

// 一组二维向量表示一个多边形轮廓坐标
const pointsArr = [
  new THREE.Vector2(-50, -50),
  new THREE.Vector2(-60, 0),
  new THREE.Vector2(0, 50),
  new THREE.Vector2(60, 0),
  new THREE.Vector2(50, -50),
]

// Shape表示一个平面多边形轮廓,参数是二维向量构成的数组pointsArr
const shape = new THREE.Shape(pointsArr);

const geometry = new THREE.ShapeGeometry(shape);


// line最后一个点不会闭合，可以使用LineLoop
// const model = new THREE.Line(geometry, material);
const model = new THREE.Line(geometry, material);

model.position.z = 450

export default model