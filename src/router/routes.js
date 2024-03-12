// 引入创建路由模式 history模式
import Layout from '../layout/index.vue'
// 引入路由各页面配置
const routes = [
  {
    path: '/',
    redirect: '/first-3d'
  },
  {
    path: '/',
    component: Layout,
    name: 'layout',
    children: [
      {
        path: '/first-3d',
        component: () => import('../views/first-3d/index.vue'),
        name: 'first3d',
        title: '第一个3D案例'
      },
      {
        path: '/axesHelper',
        component: () => import('../views/axesHelper/index.vue'),
        name: 'axesHelper',
        title: '坐标系'
      },
      {
        path: '/light',
        component: () => import('../views/light/index.vue'),
        name: 'light',
        title: '光源'
      },
      {
        path: '/orbitControls',
        component: () => import('../views/orbitControls/index.vue'),
        name: 'orbitControls',
        title: '相机轨道控制器'
      },
      {
        path: '/camera',
        component: () => import('../views/camera/index.vue'),
        name: 'camera',
        title: '相机'
      },
      {
        path: '/geometry',
        component: () => import('../views/geometry/index.vue'),
        name: 'geometry',
        title: '几何体'
      },
      {
        path: '/material',
        component: () => import('../views/material/index.vue'),
        name: 'material',
        title: '网格材质'
      },
      {
        path: '/webglRenderer',
        component: () => import('../views/webgl/index.vue'),
        name: 'webgl',
        title: 'webgl渲染器'
      },
      {
        path: '/gui-intro',
        component: () => import('../views/gui-intro/index.vue'),
        name: 'gui-intro',
        title: 'gui简单介绍'
      },
      {
        path: '/gui-visual',
        component: () => import('../views/gui-visual/index.vue'),
        name: 'gui-visual',
        title: 'gui可视化'
      },
      {
        path: '/vertices',
        component: () => import('../views/vertices/index.vue'),
        name: 'vertices',
        title: '顶点位置'
      },
      {
        path: '/bufferGeometry',
        component: () => import('../views/bufferGeometry/index.vue'),
        name: 'bufferGeometry',
        title: '几何体基类'
      },
      {
        path: '/object3d',
        component: () => import('../views/object3d/index.vue'),
        name: 'object3d',
        title: '模型基类'
      },
      {
        path: '/cloneAndCopy',
        component: () => import('../views/cloneAndCopy/index.vue'),
        name: 'cloneAndCopy',
        title: 'clone&copy'
      },
      {
        path: '/group',
        component: () => import('../views/group/index.vue'),
        name: 'group',
        title: '层级结构'
      },
      {
        path: '/textureLoader',
        component: () => import('../views/textureLoader/index.vue'),
        name: 'textureLoader',
        title: '纹理贴图'
      },
      {
        path: '/gltf',
        component: () => import('../views/gltf/index.vue'),
        name: 'gltf',
        title: '3d模型'
      },
      {
        path: '/PRB',
        component: () => import('../views/prb/index.vue'),
        name: 'PRB',
        title: 'PRB标准材质'
      },
      {
        path: '/canvas',
        component: () => import('../views/canvas/index.vue'),
        name: 'canvas',
        title: '画布'
      },
      {
        path: '/geometrydiy',
        component: () => import('../views/geometrydiy/index.vue'),
        name: 'geometrydiy',
        title: '生成曲线，几何体'
      },
      {
        path: '/effectComposer',
        component: () => import('../views/effectComposer/index.vue'),
        name: 'effectComposer',
        title: '后处理'
      },
      {
        path: '/sprite',
        component: () => import('../views/sprite/index.vue'),
        name: 'sprite',
        title: '精灵模型'
      },
      {
        path: '/ray',
        component: () => import('../views/ray/index.vue'),
        name: 'ray',
        title: '射线'
      },
      {
        path: '/keyframe',
        component: () => import('../views/keyframe/index.vue'),
        name: 'keyframe',
        title: '关键帧动画'
      },
      {
        path: '/bone',
        component: () => import('../views/bone/index.vue'),
        name: 'bone',
        title: '骨骼动画'
      },
      {
        path: '/boneExample',
        component: () => import('../views/boneExample/index.vue'),
        name: 'boneExample',
        title: '骨骼动画示例'
      },
      {
        path: '/stereoExample',
        component: () => import('../views/stereoExample/index.vue'),
        name: 'stereoExample',
        title: '立体效果'
      },
      {
        path: '/ocean',
        component: () => import('../views/ocean/index.vue'),
        name: 'ocean',
        title: '天空与大海'
      },
      {
        path: '/raycasterExample',
        component: () => import('../views/raycasterExample/index.vue'),
        name: 'raycasterExample',
        title: '射线示例'
      },
    ]
  },
 
]
 
export default routes;