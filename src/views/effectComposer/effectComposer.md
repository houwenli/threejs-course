## 后处理

所谓threejs后期处理，就像ps一样，对threejs的渲染结果进行后期处理，比如添加发光效果

## 不同功能后处理通道

查看threejs文件包目录examples/jsm/postprocessing/，你可以看到threejs提供了很多后处理通道，想实现什么样的后期处理效果，需要调用threejs对应的后处理通道扩展库。

- OutlinePass.js：高亮发光描边
- UnrealBloomPass.js：Bloom发光
- GlitchPass.js：画面抖动效果

使用方法，主要有以下几步

- 引入EffectComposer.js 大家都知道three.js WebGL渲染器执行渲染方法.render()会得到一张图像，如果你需要对一个webgl渲染器的渲染结果进行后期处理，就把它作为EffectComposer的参数。
- 引入渲染器通道RenderPass 通过EffectComposer(renderer)指定了需要后处理的渲染器WebGLRenderer，渲染器通道RenderPass的作用是指定后处理对应的相机camera和场景scene。
- 自定义不同的后处理效果，比如OutlinePass.js

## OutlinePass.js 高亮描边（举个例子）

可以给一个模型添加一个高亮发光描边

```js
// 代码中引入后处理扩展库EffectComposer.js
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// 引入渲染器通道RenderPass
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// 引入OutlinePass通道
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';


// 创建后处理对象EffectComposer，WebGL渲染器作为参数
const composer = new EffectComposer(renderer);

// 创建一个渲染器通道，场景和相机作为参数
const renderPass = new RenderPass(scene, camera);

// 设置renderPass通道
composer.addPass(renderPass);

// OutlinePass第一个参数v2的尺寸和canvas画布保持一致
const v2 = new THREE.Vector2(canvas.value.clientWidth, canvas.value.clientHeight);
// const v2 = new THREE.Vector2(800, 600);
const outlinePass = new OutlinePass(v2, scene, camera);

// 一个模型对象
outlinePass.selectedObjects = [mesh];
// 设置OutlinePass通道
composer.addPass(outlinePass);


// 最后
composer.render();

```

这里注意outlinePass.selectedObjects，可以选择后处理的元素

还有个需要注意的地方`composer.render()`，composer后处理器已经包含了WebGL渲染器，所以最后不需要再渲染一遍了，不然结果会发生覆盖

```js
    composer.render();
    // 覆盖掉上面的渲染结果
    // renderer.render( scene, camera );
```


