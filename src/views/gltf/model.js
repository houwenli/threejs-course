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
})


export default model