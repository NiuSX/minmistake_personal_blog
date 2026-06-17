# 02-图像基础与 OpenCV 入门

## 1. 图像的本质

数字图像是一个二维或三维数组。灰度图通常是二维数组，彩色图通常是三维数组。

灰度图：

```text
height x width
```

彩色图：

```text
height x width x channels
```

每个像素是一个数值。常见 8 位图像像素范围是 0 到 255：

- 0 表示黑。
- 255 表示白。
- 中间值表示不同亮度。

彩色图像通常有 3 个通道，例如 RGB：

- R：红色。
- G：绿色。
- B：蓝色。

OpenCV 默认使用 BGR 顺序，不是 RGB。

## 2. 图像坐标系

OpenCV 图像坐标：

- 左上角是原点。
- x 向右增加。
- y 向下增加。
- 像素访问通常是 `image[y, x]`。

这一点非常重要。很多初学者会把 x、y 顺序写反。

## 3. 常见图像格式

- JPG：有损压缩，适合自然图像。
- PNG：无损压缩，支持透明通道。
- BMP：未压缩或简单压缩，文件较大。
- TIFF：常用于工业、医学、遥感。
- RAW：相机原始数据。

注意：

- JPG 压缩会引入伪影，不适合精密测量。
- PNG 保留边缘更好，适合标注图、mask。
- 医学和工业可能使用 16 位图像，不要默认所有图都是 8 位。

## 4. 色彩空间

### 4.1 RGB/BGR

RGB 符合人类显示习惯，OpenCV 使用 BGR。

```python
import cv2

img_bgr = cv2.imread("image.jpg")
img_rgb = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2RGB)
```

### 4.2 灰度图

灰度图减少通道，适合边缘、阈值、形态学等处理。

```python
gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
```

灰度不是简单平均 RGB，而是按人眼敏感度加权。

### 4.3 HSV

HSV 包含：

- H：色相。
- S：饱和度。
- V：亮度。

适合按颜色分割。例如提取红色、蓝色、绿色目标时，HSV 通常比 RGB 稳定。

### 4.4 Lab

Lab 把亮度和颜色信息分离，在颜色校正、亮度均衡、色差计算中常用。

## 5. OpenCV 基本操作

### 5.1 读取和保存

```python
import cv2

img = cv2.imread("test.jpg")
cv2.imwrite("out.png", img)
```

检查读取是否成功：

```python
if img is None:
    raise FileNotFoundError("image not found")
```

### 5.2 查看尺寸

```python
h, w = img.shape[:2]
print(w, h)
```

### 5.3 裁剪 ROI

```python
roi = img[y1:y2, x1:x2]
```

ROI 是 Region of Interest，感兴趣区域。很多工业视觉项目会先定位 ROI，再在 ROI 内做检测，降低干扰和计算量。

### 5.4 缩放

```python
resized = cv2.resize(img, (640, 480))
```

注意：

- 放大图像常用双线性或双三次插值。
- 缩小图像常用面积插值。
- 训练模型时缩放可能改变目标比例，要注意标注同步变换。

### 5.5 画图

```python
cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
cv2.circle(img, (cx, cy), 5, (0, 0, 255), -1)
cv2.putText(img, "target", (x1, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 0, 0), 2)
```

## 6. 图像数据类型

常见类型：

- `uint8`：0 到 255，最常见。
- `uint16`：0 到 65535，医学、工业相机常见。
- `float32`：神经网络输入、归一化图像。

注意：

```python
img_float = img.astype("float32") / 255.0
```

如果直接对 `uint8` 做加减，可能出现溢出。

## 7. 直方图

直方图统计每个灰度值出现次数。

用途：

- 判断图像亮暗。
- 判断对比度。
- 阈值分割。
- 直方图均衡化。
- 图像匹配。

```python
hist = cv2.calcHist([gray], [0], None, [256], [0, 256])
```

直方图集中在左侧，图像偏暗；集中在右侧，图像偏亮；范围很窄，对比度低。

## 8. 常见图像问题

- 过曝：亮部细节丢失。
- 欠曝：暗部细节丢失。
- 模糊：运动模糊、失焦模糊。
- 噪声：随机亮点、暗点、彩色噪声。
- 反光：局部高亮，影响阈值和检测。
- 阴影：导致同一目标亮度不一致。
- 畸变：镜头导致直线弯曲。
- 压缩伪影：JPG 块状噪声。

## 9. OpenCV 学习练习

1. 读取图片并打印宽高和通道数。
2. 把图片转灰度、HSV、Lab。
3. 裁剪目标区域并保存。
4. 画矩形框和文字。
5. 统计灰度直方图。
6. 提取指定颜色区域。
7. 用摄像头实时显示图像。

