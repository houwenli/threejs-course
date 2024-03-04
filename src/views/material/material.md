## 材质
### 基础网格材质MeshBasicMaterial
不受光照影响

### 漫反射网格材质MeshLambertMaterial

### 高光反射网格材质MeshPhongMaterial

#### 镜面反射与漫反射
MeshPhongMaterial可以提供一个镜面反射效果,可以类比你生活中拿一面镜子，放在太阳光下，调整角度，可以把太阳光反射到其它地方，如果反射光对着眼睛，也就是反射光线和视线平行的时候，会非常刺眼。

MeshLambertMaterial对应的Mesh受到光线照射，没有镜面反射的效果，只是一个漫反射，也就是光线向四周反射。

MeshPhongMaterial可以实现MeshLambertMaterial不能实现的高光反射效果。对于高光效果，你可以想象一下，你在太阳下面观察一辆车，你会发现在特定角度和位置，你可以看到车表面某个局部区域非常高亮。
