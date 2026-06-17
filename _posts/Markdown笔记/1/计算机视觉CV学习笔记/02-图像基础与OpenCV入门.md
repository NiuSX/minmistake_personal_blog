# 02-图像基础与 OpenCV 入门

<!-- lecture-notes:integrated-v2 -->

## 讲义导读：从像素到可用视觉系统

这一章讲的是 **02-图像基础与 OpenCV 入门**。阅读时不要只记 OpenCV 函数、模型名字或论文缩写，而要把它放进完整视觉链路：图像如何采集，像素和颜色空间是否正确，光照和噪声如何影响结果，相机几何是否成立，模型输入和标注是否一致，评价指标是否对应漏检误检成本，部署时前后处理、延迟和现场漂移是否可控。CV 的目标不是让一张样例图看起来成功，而是在真实图像分布中稳定输出可用信息。

### 一句话先懂

图像在程序里首先是数组：宽高、通道、数据类型、颜色空间和坐标系决定后续所有处理是否正确。

### 通俗类比

可以把 CV 系统想成流水线上的质检员：相机和光源负责把产品拍清楚，预处理像擦干净镜头和统一灯光，传统特征或神经网络负责看重点，检测和分割负责指出位置，后处理负责合并和过滤结果，评估指标负责统计漏检、误检和定位偏差，部署监控负责发现现场条件变化。

类比只是第一层直觉。回到技术上，要把每一步写成明确对象：输入图像的尺寸、通道、数据类型、坐标系、标注格式、模型输出、阈值、指标和运行环境。视觉问题很容易被表面效果迷惑，必须用可复现样本和量化指标来判断。

### 本章学习主线

1. **图像来源**：确认采集设备、光照、分辨率、帧率、压缩、畸变和场景覆盖。
2. **表示方式**：弄清像素数组、通道顺序、颜色空间、坐标系、数据类型和归一化。
3. **算法假设**：说明方法依赖什么条件，例如边缘明显、光照稳定、尺度不变、训练分布一致或标注可靠。
4. **输出解释**：区分类别、框、mask、关键点、文字、轨迹、三维点和置信度的含义。
5. **评估诊断**：用 IoU、mAP、Dice、OCR 准确率、MOT 指标、延迟和错误样本定位问题。
6. **工程闭环**：把训练、推理、后处理、可视化、日志、监控和现场迭代连起来。

### 概念怎么学才不容易忘

遇到视觉算法时，建议按 白话作用 -> 输入输出 -> 图像假设 -> 参数含义 -> 可视化结果 -> 失败样本 六步学习。比如 Canny 不只是一个函数，要看梯度、阈值和噪声；YOLO 不只是一个模型，要看输入尺寸、置信度、NMS、mAP 和小目标漏检；相机标定不只是拿到内参，要看重投影误差和畸变是否影响实际测量。

### 最小实践任务

读取一张图片，分别查看 shape、dtype、BGR/RGB、灰度图、直方图和 ROI 裁剪结果。

实践时要保留失败样本：反光、模糊、遮挡、过曝、欠曝、背景相似、标注不一致、小目标、长尾类别、视频抖动、部署前后处理不一致。这些样本比单张成功截图更能说明系统边界。

### 读完本章应该能做到

- 用自己的话解释本章主题在 CV 流水线中的位置。
- 画出最小处理流程，标清输入图像、关键参数、输出结果和评价指标。
- 说出至少三个常见失败场景，以及对应的可视化或量化诊断方法。
- 给出一个可复现实验，能比较参数、数据或模型变化带来的影响。
- 能解释像素、通道、BGR/RGB、HSV、坐标系、图像类型、插值和 OpenCV 基本读写操作。

> 本节是讲义化阅读入口，后续正文中的图像基础、传统算法、深度模型、评估指标和部署实践都应围绕这条视觉链路来理解。

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

## 2026 CV 资料与工程核对补充

计算机视觉的基础概念稳定，但模型生态、部署工具和数据集规范变化很快。复现实验前建议记录 Python、OpenCV、PyTorch、TorchVision、CUDA、cuDNN、ONNX Runtime、TensorRT、Ultralytics 或相关库版本，同时记录输入尺寸、颜色空间、归一化方式、类别表、标注格式、阈值、NMS 参数和硬件环境。

视觉项目尤其要防止训练和部署前后处理不一致。常见问题包括 BGR/RGB 搞反、归一化均值方差不同、resize 与 letterbox 不一致、坐标缩放错误、类别 id 对不上、置信度阈值和 NMS 阈值变化、摄像头现场光照不同。

### 资料入口

- OpenCV Documentation: https://docs.opencv.org/
- OpenCV Image Processing Tutorials: https://docs.opencv.org/4.x/d7/da8/tutorial_table_of_content_imgproc.html
- OpenCV Camera Calibration: https://docs.opencv.org/4.x/dc/dbb/tutorial_py_calibration.html
- TorchVision Documentation: https://pytorch.org/vision/stable/index.html
- TorchVision Models: https://pytorch.org/vision/stable/models.html
- COCO Dataset and Evaluation: https://cocodataset.org/#detection-eval
- Ultralytics Documentation: https://docs.ultralytics.com/
- ONNX Runtime Documentation: https://onnxruntime.ai/docs/
- NVIDIA TensorRT Documentation: https://docs.nvidia.com/deeplearning/tensorrt/

OpenCV 和传统算法章节要特别核对图像数据类型、通道顺序、坐标系和阈值范围。很多错误不是算法错，而是输入范围、颜色空间或参数单位错。
