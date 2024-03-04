## gui库
说白了其实就是一个前端js库，对HTML、CSS和JavaScript进行了封装

学习开发的时候，可以使用gui库快速创建控制三维场景的ui交互界面

其实gui库和threejs一点关系都没有


### 使用方法
```js
import {GUI} from 'three/examples/jsm/libs/lil-gui.module.min'

const obj = ref({
  x: 30,
  y: 0.5,
  z: 1000
})

const gui = new GUI()

gui.add(obj.value, 'x', 0, 100)
gui.add(obj.value, 'y', 0, 1)
gui.add(obj.value, 'z', 500, 2000)

```