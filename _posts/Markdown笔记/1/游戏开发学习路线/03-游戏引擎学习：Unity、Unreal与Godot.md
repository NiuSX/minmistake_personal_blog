# 03-游戏引擎学习：Unity、Unreal 与 Godot

## 1. 游戏引擎是什么

游戏引擎提供制作游戏的基础能力：

- 场景编辑。
- 资源管理。
- 渲染。
- 物理。
- 动画。
- 音频。
- UI。
- 脚本。
- 打包发布。
- 调试工具。

使用引擎可以避免从零写底层系统，把精力放到游戏本身。

## 2. Unity

特点：

- 使用 C#。
- 2D 和 3D 都适合。
- 教程和插件多。
- 移动端、独立游戏、VR/AR 使用广。

需要学习：

- GameObject 和 Component。
- Transform。
- Prefab。
- Scene。
- MonoBehaviour 生命周期。
- Rigidbody 和 Collider。
- Animator。
- UI Toolkit 或 UGUI。
- ScriptableObject。
- Addressables。
- 打包和平台设置。

常见生命周期：

```csharp
void Awake() {}
void Start() {}
void Update() {}
void FixedUpdate() {}
void OnDestroy() {}
```

## 3. Unreal Engine

特点：

- 画面能力强。
- 蓝图可视化脚本强大。
- C++ 可扩展。
- 适合 3D、动作、射击、开放场景和高品质项目。

需要学习：

- Actor。
- Component。
- Pawn 和 Character。
- Blueprint。
- Level。
- Material。
- Animation Blueprint。
- Behavior Tree。
- Gameplay Framework。
- Packaging。

学习建议：

- 先用蓝图做完整原型。
- 再学 C++ 扩展性能和复杂系统。

## 4. Godot

特点：

- 开源。
- 轻量。
- 节点系统清晰。
- 适合 2D 和中小型项目。
- 常用 GDScript。

需要学习：

- Node。
- Scene。
- Signal。
- Resource。
- Physics。
- AnimationPlayer。
- Control UI。
- Export。

## 5. 如何选择引擎

| 目标 | 推荐 |
| --- | --- |
| 初学 2D/3D 通用 | Unity |
| 高品质 3D、写实、动作射击 | Unreal |
| 开源轻量、2D、小项目 | Godot |
| Web 小游戏 | Phaser、PixiJS、Three.js |
| 从底层学习 | SDL、Raylib、MonoGame |

选择原则：

- 先选资料多、容易做完项目的。
- 不要频繁换引擎。
- 引擎只是工具，核心是能做出完整游戏。

## 6. 引擎通用概念

无论用哪个引擎，都要学：

- 场景。
- 对象。
- 组件。
- 资源。
- 脚本。
- 输入。
- 物理。
- 动画。
- UI。
- 音频。
- 相机。
- 光照。
- 打包。

## 7. 引擎学习路线

1. 熟悉编辑器界面。
2. 创建场景和对象。
3. 编写脚本控制移动。
4. 处理输入。
5. 使用物理和碰撞。
6. 制作 UI。
7. 播放音效和动画。
8. 做一个完整小关卡。
9. 加开始、暂停、结算界面。
10. 打包给别人试玩。

## 8. 常见误区

- 只看教程，不自己改。
- 一上来安装大量插件。
- 不理解引擎生命周期。
- 所有逻辑写在一个脚本里。
- 不管理资源命名和目录。
- 没做打包测试。

