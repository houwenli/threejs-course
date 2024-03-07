// 不规则的曲线
// 样条曲线和贝塞尔曲线

// 椭圆
// 可以想象一下，圆弧上的点的坐标是和sin。cos相关的

import * as THREE from 'three'

const geometry = new THREE.BufferGeometry() // 创建一个几何体

const material = new THREE.LineBasicMaterial({
  color: 0xff0000
})

// // p1、p2、p3表示三个点坐标
// // p1、p3是曲线起始点，p2是曲线的控制点
// const p1 = new THREE.Vector2(-80, 0);
// const p2 = new THREE.Vector2(20, 100);
// const p3 = new THREE.Vector2(80, 0);

// // 二维二次贝赛尔曲线
// const curve = new THREE.QuadraticBezierCurve(p1, p2, p3);

// p1、p2、p3表示三个点坐标
const p1 = new THREE.Vector3(-80, 0, 0);
const p2 = new THREE.Vector3(20, 100, 0);
const p3 = new THREE.Vector3(80, 0, 100);
// 三维二次贝赛尔曲线
const curve = new THREE.QuadraticBezierCurve3(p1, p2, p3);


//曲线上获取点
const pointsArr = curve.getPoints(100); 
//读取坐标数据赋值给几何体顶点
geometry.setFromPoints(pointsArr); 

// line最后一个点不会闭合，可以使用LineLoop
// const model = new THREE.Line(geometry, material);
const model = new THREE.Line(geometry, material);

model.position.z = 150

export default model