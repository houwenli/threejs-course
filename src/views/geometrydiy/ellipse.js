// 椭圆
// 可以想象一下，圆弧上的点的坐标是和sin。cos相关的

import * as THREE from 'three'

const geometry = new THREE.BufferGeometry() // 创建一个几何体

// 参数1和2表示椭圆中心坐标  参数3和4表示x和y方向半径
// const arc = new THREE.EllipseCurve(0, 0, 100, 50);

// geometry.setFromPoints(arc.getPoints(50))


// const material = new THREE.LineBasicMaterial({
//   color: 0xff0000
// })

// 圆形
const arc = new THREE.ArcCurve(0, 0, 100, 0, 1.5 * Math.PI);

geometry.setFromPoints(arc.getPoints(50))


const material = new THREE.LineBasicMaterial({
  color: 0xff0000
})

// line最后一个点不会闭合，可以使用LineLoop
// const model = new THREE.Line(geometry, material);
const model = new THREE.LineLoop(geometry, material);

model.position.z = 50

export default model