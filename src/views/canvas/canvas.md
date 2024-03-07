## Three.js渲染结果保存为图片

## 超链接元素a下载文件

```js
function saveFile() {
    // 创建一个超链接元素，用来下载保存数据的文件
    const link = document.createElement('a');
    // 通过超链接herf属性，设置要保存到文件中的数据
    link.href = window.URL.createObjectURL(new Blob(['一些数据']));
    link.download = '文件名称.txt';//下载文件名
    link.click();//js代码触发超链接元素a的鼠标点击事件，开始下载文件到本地
  }
```

### 配置webgl渲染器preserveDrawingBuffer:true

```js
const renderer = new THREE.WebGLRenderer({
    //想把canvas画布上内容下载到本地，需要设置为true
    preserveDrawingBuffer:true,
});
```

## 深度冲突(模型闪烁)
实际开发的过程中，你可能会遇到的模型闪烁问题。

对于模型闪烁的原因简单地说就是深度冲突，对应的英文关键词是Z-fighting

这种现象，主要是两个Mesh重合，电脑GPU分不清谁在前谁在后，这种现象，可以称为深度冲突Z-fighting

### 两个矩形Mesh拉开距离
适当偏移，解决深度冲突，偏移尺寸相对模型尺寸比较小，视觉上两个平面近似还是重合效果
```js
mesh2.position.z = 1;
```

### 透视投影相机对距离影响(深度冲突)

当一个三维场景中有一些面距离比较近，有深度冲突，你可以尝试设置webgl渲染器设置对数深度缓冲区logarithmicDepthBuffer: true来优化或解决。

```js
// WebGL渲染器设置
const renderer = new THREE.WebGLRenderer({
    // 设置对数深度缓冲区，优化深度冲突问题
    logarithmicDepthBuffer: true
});
```