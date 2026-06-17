# 03-游戏引擎学习：Unity、Unreal 与 Godot

<!-- lecture-notes:integrated-v2 -->

## 讲义导读：从原型到可玩的游戏

这一章讲的是 **03-游戏引擎学习：Unity、Unreal 与 Godot**，属于 **游戏引擎学习**。学习游戏开发时，不要只收集引擎教程、API 和工具名，而要把每个知识点放进一条作品闭环：先做出可操作的原型，再补反馈、内容、UI、测试、优化和发布，最后用真实试玩记录决定下一步改什么。

### 一句话先懂

引擎学习的重点是理解它帮你管理了什么：场景、对象、组件、资源、渲染、物理、输入、动画、UI 和打包。

初学时先问三个问题：玩家能做什么，系统怎样回应，玩家为什么愿意继续玩。只要这三个问题不清楚，技术越堆越多，项目越容易变成半成品。

### 通俗类比

引擎像已经搭好的剧场：灯光、舞台、道具库和控制台都有了，学习者要学会按剧本组织演出，而不是只研究每个按钮。

类比只是入口。真正做游戏时，要回到游戏循环、输入延迟、反馈、状态机、关卡节奏、资源规范、性能预算、构建版本和玩家测试这些可执行对象上。

### 本章学习主线

1. **先做最小可玩原型**：角色能动，目标清楚，有失败和胜利，能重开。
2. **再补核心反馈**：输入、命中、受伤、奖励、错误、加载和过场都要有及时反馈。
3. **然后扩展内容**：关卡、敌人、道具、任务和数值要服务核心循环，而不是单纯堆量。
4. **接着做工程化**：资源命名、版本管理、存档、配置、调试工具、性能分析和构建流程要跟上。
5. **最后做试玩复盘**：观察玩家哪里不懂、哪里无聊、哪里卡住，再按证据调整。

### 本章重点抓手

Unity、Unreal、Godot 的项目结构、场景/节点/Actor、组件、脚本、资源导入、预制体/蓝图、调试和构建发布。

### 最小实践任务

同一个 2D 小游戏分别用一个引擎做最小版本，比较场景组织、脚本模型、资源流程和打包体验。

建议每个学习阶段都产出一个可运行版本，并记录：目标、核心循环、操作方式、已完成内容、已知问题、试玩反馈和下一版改动。游戏开发最怕长期“学习中”却没有作品；小而完整的游戏，比庞大但不可玩的工程更有价值。

### 常见误区

- 一开始就频繁换引擎。
- 只学编辑器操作，不理解对象生命周期。
- 不看官方版本文档，教程和当前引擎界面对不上。

### 推荐工具与资料

Unity Learn/Unity Docs、Unreal Engine Documentation、Godot Docs、MDN Game Development、Git、itch.io/Steamworks 文档、性能分析器。

### 读完本章应该能做到

- 用自己的话说明本章内容服务于游戏作品的哪个环节。
- 做出一个能试玩的最小版本，而不是只完成孤立功能。
- 根据玩家反馈或性能数据提出下一版改动。
- 把引擎教程转化成自己的项目能力和作品集证据。

> 本节是讲义化改写后的阅读入口。后续正文中的路线、工具、清单和项目建议，都应围绕“可玩原型 + 反馈迭代 + 可发布版本”来理解。
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

## 2026 游戏开发资料与项目核对补充

游戏开发路线建议按“官方文档 + 小项目 + 玩家反馈”三层学习。

- **引擎资料**：Unity 以 Unity Learn 和 Unity Documentation 为准；Unreal 以 Epic Developer Community / Unreal Engine Documentation 为准；Godot 以 Godot stable documentation 为准。
- **Web 游戏**：HTML5、Canvas、WebGL、WebGPU、Web Audio 和浏览器兼容性优先查 MDN Web Docs。
- **项目方法**：引擎学习以 Unity、Unreal、Godot 官方文档为准；Web 游戏查 MDN；发布平台和多人后端查对应官方文档。 学一个系统就做一个小版本，避免只看教程不交付。
- **发布核对**：目标平台、输入设备、分辨率、性能、存档、崩溃日志、商店素材、许可证和第三方资源授权都要提前确认。
- **作品集要求**：展示最终视频和截图之外，还要写清核心玩法、技术实现、工具链、遇到的问题、如何测试和如何迭代。

通俗地说，官方文档告诉你工具怎么用，小项目证明你能做出来，玩家反馈告诉你哪里真的需要改。三者结合，才是有效的游戏开发学习路线。

参考资料：

- Unity Learn：https://learn.unity.com/
- Unity Documentation：https://docs.unity.com/
- Unreal Engine Documentation：https://dev.epicgames.com/documentation/en-us/unreal-engine
- Godot Documentation：https://docs.godotengine.org/
- MDN Game Development：https://developer.mozilla.org/en-US/docs/Games
- MDN Web APIs：https://developer.mozilla.org/en-US/docs/Web/API
- Steamworks Documentation：https://partner.steamgames.com/doc/home
- itch.io Creator Resources：https://itch.io/docs/creators/getting-started
