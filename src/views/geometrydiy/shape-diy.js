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


// // Shape表示一个平面多边形轮廓
// const shape = new THREE.Shape();
// const path = new THREE.Path();
// shape.moveTo(10, 0)

// shape.lineTo(100, 0);
// shape.arc(-50,0,50,0,Math.PI*2);
// shape.lineTo(100, 100)
// shape.lineTo(  10, 100)
// console.log('currentPoint',shape.currentPoint);


// 绘制一个带孔洞的shape
const shape = new THREE.Shape();
shape.lineTo(100, 0);
shape.lineTo(100, 100)
shape.lineTo(  10, 100)

const path1 = new THREE.Path()
path1.absarc(20, 20, 10);

const path2 = new THREE.Path()
path2.absarc(80, 20, 10);

const path3 = new THREE.Path();// 方形孔
path3.moveTo(50, 50);
path3.lineTo(80, 50);
path3.lineTo(80, 80);
path3.lineTo(50, 80);

shape.holes.push(path1, path2,path3);

const geometry = new THREE.ExtrudeGeometry(shape, {
  depth: 20
});


// line最后一个点不会闭合，可以使用LineLoop
// const model = new THREE.Line(geometry, material);
const model = new THREE.Mesh(geometry, material);

model.position.x = 200
model.position.z = 100

export default model