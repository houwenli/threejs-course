### 各种几何体
```js
//BoxGeometry：长方体
const geometry = new THREE.BoxGeometry(100, 100, 100);
// SphereGeometry：球体
const geometry = new THREE.SphereGeometry(50);
// CylinderGeometry：圆柱
// 上半径,下半径,圆柱高,上下半径不一致就是圆台形状
const geometry = new THREE.CylinderGeometry(50,50,100);
// PlaneGeometry：矩形平面
const geometry = new THREE.PlaneGeometry(100,50);
// CircleGeometry：圆形平面
const geometry = new THREE.CircleGeometry(50);
```