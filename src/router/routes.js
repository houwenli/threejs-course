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
    ]
  },
 
]
 
export default routes;