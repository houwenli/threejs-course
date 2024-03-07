// 圆弧
// 可以想象一下，圆弧上的点的坐标是和sin。cos相关的

import * as THREE from 'three'

const geometry = new THREE.BufferGeometry() // 创建一个几何体

const R = 100; // 圆弧半径
const N = 50; // 分段数量

// 设置圆心坐标
const cx = 0;
const cy = 0;

const sp = 2 * Math.PI / N; // 两个点相隔的弧度，累家值就是当前点的弧度

// 批量生成圆弧上的顶点数据
const arr = [];
for (let i = 0; i < N; i++) {
    const angle =  sp * i;//当前点弧度
    // 以坐标原点为中心，在XOY平面上生成圆弧上的顶点数据
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    arr.push(x, y, 0);
}

//类型数组创建顶点数据
const vertices = new Float32Array(arr);
// 创建属性缓冲区对象
//3个为一组，表示一个顶点的xyz坐标
const attribue = new THREE.BufferAttribute(vertices, 3); 
// 设置几何体attributes属性的位置属性
geometry.attributes.position = attribue;

const pointsArr = [
  // 三维向量Vector3表示的坐标值
  new THREE.Vector3(0,0,0),
  new THREE.Vector3(0,100,0),
  new THREE.Vector3(0,100,100),
  new THREE.Vector3(0,0,100),
];

// const pointsArr = [
//   // 二维向量Vector2表示的坐标值
//   new THREE.Vector2(0,0),
//   new THREE.Vector2(100,0),
//   new THREE.Vector2(100,100),
//   new THREE.Vector2(0,100),
// ];

// geometry.setFromPoints(pointsArr);


const material = new THREE.LineBasicMaterial({
  color: 0xff0000
})

// line最后一个点不会闭合，可以使用lineloop
// const model = new THREE.Line(geometry, material);
const model = new THREE.LineLoop(geometry, material);

export default model