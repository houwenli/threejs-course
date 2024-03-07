// 不规则的曲线
// 样条曲线和贝塞尔曲线

// 椭圆
// 可以想象一下，圆弧上的点的坐标是和sin。cos相关的

import * as THREE from 'three'

const material = new THREE.LineBasicMaterial({
  color: 0xff0000,
  // side:THREE.DoubleSide,//双面显示看到管道内壁
})

// 三维样条曲线
const path = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-50, 20, 90),
  new THREE.Vector3(-10, 40, 40),
  new THREE.Vector3(0, 0, 0),
  new THREE.Vector3(60, -60, 0),
  new THREE.Vector3(70, 0, 80)
]);

// path:路径   40：沿着轨迹细分数  2：管道半径   25：管道截面圆细分数
const geometry = new THREE.TubeGeometry(path, 40, 10, 25);


// line最后一个点不会闭合，可以使用LineLoop
// const model = new THREE.Line(geometry, material);
const model = new THREE.Line(geometry, material);

model.position.z = 300

export default model