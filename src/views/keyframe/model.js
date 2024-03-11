import * as THREE from 'three'

// 引入gltf模型加载库GLTFLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'

import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'

// 创建GLTF加载器对象
const loader = new GLTFLoader();
const dracoLoader = new DRACOLoader();

console.log(new URL('./', import.meta.url).pathname + '/')
dracoLoader.setDecoderPath(new URL('./', import.meta.url).pathname + '/gltf/');

loader.setDRACOLoader( dracoLoader );

const model = new THREE.Group()
model.position.y = 500
let mixer = null

loader.load(new URL('./model/LittlestTokyo.glb', import.meta.url).href, function (gltf) {
  // 返回的场景对象gltf.scene插入到threejs场景中
  model.add( gltf.scene );
  console.log(1111, gltf)

  //包含帧动画的模型作为参数创建一个播放器
  mixer = new THREE.AnimationMixer(gltf.scene);
  //  获取gltf.animations[0]的第一个clip动画对象
  const clipAction = mixer.clipAction(gltf.animations[0]);//创建动画clipAction对象
  clipAction.play();//播放动画
})

export {
  model,
  mixer
}