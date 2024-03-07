// 不规则的曲线
// 样条曲线和贝塞尔曲线

// 椭圆
// 可以想象一下，圆弧上的点的坐标是和sin。cos相关的

import * as THREE from 'three'

const geometry = new THREE.BufferGeometry() // 创建一个几何体

const material = new THREE.LineBasicMaterial({
  color: 0xff0000
})

// // 三维向量Vector3创建一组顶点坐标
// const arr = [
//   new THREE.Vector3(-50, 20, 90),
//   new THREE.Vector3(-10, 40, 40),
//   new THREE.Vector3(0, 0, 0),
//   new THREE.Vector3(60, -60, 0),
//   new THREE.Vector3(70, 0, 80)
// ]
// // 三维样条曲线
// const curve = new THREE.CatmullRomCurve3(arr);

const arr = [
  new THREE.Vector2(-100, 0),
  new THREE.Vector2(0, 30),
  new THREE.Vector2(100, 0),
];
// 二维样条曲线
const curve = new THREE.SplineCurve(arr);

//曲线上获取点
const pointsArr = curve.getPoints(100); 
//读取坐标数据赋值给几何体顶点
geometry.setFromPoints(pointsArr); 

// line最后一个点不会闭合，可以使用LineLoop
// const model = new THREE.Line(geometry, material);
const model = new THREE.Line(geometry, material);

model.position.z = 100

export default model