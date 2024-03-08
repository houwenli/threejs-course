## 精灵模型Sprite

精灵指包含于场景中的二维图像或动画。主要用来做标签，`因为精灵模型的正面一直平行于canvas画布。`

Three.js的精灵模型Sprite和Threejs的网格模型Mesh一样都是模型对象，父类都是Object3D,关于精灵模型对象Sprite的方法和属性除了可以查看文档Sprite，也可以查看父类Object3D。

## 创建精灵模型材质SpriteMaterial

精灵材质对象SpriteMaterial和普通的网格材质一样可以设置颜色.color、颜色贴图.map、开启透明.transparent、透明度.opacity等属性，精灵材质对象SpriteMaterial的父类是材质Material。

精灵模型Sprite默认是一个矩形形状，默认长宽都是1，默认在坐标原点位置。Sprite默认尺寸为1

## 对比Sprite和矩形平面Mesh

Sprite形状是矩形，PlaneGeometry创建的网格模型Mesh的形状也是矩形。

Sprite与矩形平面Mesh的区别在于,当你旋转三维场景的时候，如果通过相机控件OrbitControls旋转测试，你可以发现Sprite矩形平面会始终平行于Canvas画布或者说屏幕，而矩形平面Mesh的姿态角度会跟着旋转，不一定平行于canvas画布

## sprite也可以缩放和旋转
