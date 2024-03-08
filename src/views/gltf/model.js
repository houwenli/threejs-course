import * as THREE from 'three'

// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

// 创建GLTF加载器对象
const loader = new GLTFLoader();

const model = new THREE.Group()

loader.load( new URL('./collision-world.glb', import.meta.url).href, function ( gltf ) {
  console.log('控制台查看加载gltf文件返回的对象结构',gltf);
  console.log('gltf对象场景属性',gltf.scene);
  // 返回的场景对象gltf.scene插入到threejs场景中
  model.add( gltf.scene );

  var boundingBox = new THREE.Box3().setFromObject(gltf.scene)
  var size = new THREE.Vector3();
  boundingBox.getSize( size );
  // Width: 34.357852935791016, Height: 8.60006332397461, Depth: 34.35785484313965
  console.log( "Width: " + size.x + ", Height: " + size.y + ", Depth: " + size.z );

  gltf.scene.traverse(function(obj) {
    if (obj.isMesh) {//判断是否是网格模型
      console.log('模型节点',obj);
      console.log('模型节点名字',obj.name);
      console.log('材质', obj.material)
      
      // obj.material = obj.material.clone();


      // 给模型上色
      // 思路获取所有的顶点，给每个顶点颜色
      const pos = obj.geometry.attributes.position
      const count = pos.count

      // 获取所有的y轴坐标，读取最高值和最低值，计算高度差
      // 1. 计算模型y坐标高度差
      const yArr = [];//顶点所有y坐标，也就是地形高度

      for (let i = 0; i < count; i++) {
        yArr.push(pos.getY(i));//获取顶点y坐标，也就是地形高度
      }

      yArr.sort();//数组元素排序，从小到大
      const miny = yArr[0];//y最小值
      const maxy = yArr[yArr.length - 1];//y最大值
      const height = maxy - miny; // 高度差
      
      // 2. 计算每个顶点的颜色值
      // 根据模型顶点高度设置渐变颜色
      const colorsArr = [];
      const c1 = new THREE.Color(0x234567);//模型顶点颜色
      const c2 = new THREE.Color(0xff0000);//模型最低点颜色

      for (let i = 0; i < count; i++) {
        //当前高度和整体高度比值
        const percent = (pos.getY(i) - miny) / height;
        const c = c1.clone().lerp(c2, percent);//颜色插值计算
        colorsArr.push(c.r, c.g, c.b); 
      }

      const colors = new Float32Array(colorsArr);
      // 设置几何体attributes属性的颜色color属性
      // obj.geometry.attributes.color = new THREE.BufferAttribute(colors, 3);

      obj.castShadow = true

      obj.material = new THREE.MeshLambertMaterial({
        color:0xffffff,
        side: THREE.DoubleSide,
        // Mesh渲染山脉顶点颜色
        // vertexColors:true,
      });

    }
  });
}, function(xhr) {
  const percent = xhr.loaded / xhr.total;
  console.log(`process is: ${percent}`)
})


export default model