# 40 PCB 与硬件设计术语表

## 学习目标

学完本章，你应该能：

- 快速查阅 PCB、元器件、制造、信号、电源、调试相关术语。
- 看懂数据手册、板厂能力表和 EDA 设置中的常见英文词。
- 区分容易混淆的概念。

术语不是为了背诵，而是为了读文档、提问题和做设计评审时表达准确。

## 1. PCB 基础术语

| 术语 | 英文 | 解释 |
| :--- | :--- | :--- |
| 印制电路板 | PCB, Printed Circuit Board | 用铜箔、绝缘基材和孔连接器件的电路载体 |
| 原理图 | Schematic | 描述电气连接关系的图，不代表物理位置 |
| PCB 布局 | Placement | 在板上摆放元器件 |
| PCB 布线 | Routing | 用铜线、过孔、铺铜连接网络 |
| 网络 | Net | 原理图中电气相连的一组点 |
| 飞线 | Ratsnest / Airwire | PCB 中尚未布线但需要连接的提示线 |
| 板框 | Board Outline / Edge Cuts | PCB 外形边界 |
| 层叠 | Stackup | PCB 各铜层、介质层、阻焊层的结构 |
| 铜层 | Copper Layer | 用于走线、铺铜、平面的导电层 |
| 顶层 | Top Layer | PCB 正面铜层 |
| 底层 | Bottom Layer | PCB 背面铜层 |
| 内层 | Inner Layer | 多层板内部铜层 |
| 平面层 | Plane | 通常作为 GND 或电源的大面积铜层 |
| 铺铜 | Copper Pour / Zone | 大面积铜区域，可连接到指定网络 |
| 孤岛铜 | Copper Island | 没有有效连接的铜皮，通常应移除 |

## 2. 制造与工艺术语

| 术语 | 英文 | 解释 |
| :--- | :--- | :--- |
| 线宽 | Trace Width | 铜走线宽度 |
| 线距 | Clearance / Spacing | 两个导体之间的距离 |
| 孔径 | Drill Size | 钻孔直径 |
| 过孔外径 | Via Diameter | 过孔焊盘外径 |
| 孔环 | Annular Ring | 孔边缘到焊盘边缘的铜环宽度 |
| 阻焊 | Solder Mask | 覆盖铜皮、防止焊锡乱流的绝缘层 |
| 阻焊开窗 | Solder Mask Opening | 露出焊盘的阻焊层开口 |
| 丝印 | Silkscreen / Legend | 板上文字、符号、方向标识 |
| 表面处理 | Surface Finish | 焊盘表面工艺，如 HASL、ENIG |
| HASL | Hot Air Solder Leveling | 热风整平，常见低成本表面处理 |
| ENIG | Electroless Nickel Immersion Gold | 化学镍金，平整度好，适合细间距 |
| V-Cut | V-Score | V 型槽拼板分板方式 |
| 邮票孔 | Mouse Bite | 小孔连接的拼板分板方式 |
| 阻抗控制 | Impedance Control | 通过线宽、线距、介质厚度控制传输线阻抗 |
| Gerber | Gerber Files | PCB 制造图形文件 |
| Drill | Drill File | 钻孔文件 |
| BOM | Bill of Materials | 物料清单 |
| CPL | Component Placement List | 贴片坐标文件，也叫 Pick and Place |
| DFM | Design for Manufacturing | 面向制造的设计 |
| DFA | Design for Assembly | 面向装配的设计 |
| DFT | Design for Test | 面向测试的设计 |

## 3. 元器件与封装术语

| 术语 | 英文 | 解释 |
| :--- | :--- | :--- |
| 符号 | Symbol | 原理图中代表器件功能和引脚的图形 |
| 封装 | Footprint / Package | PCB 上焊盘和外形的物理定义 |
| 引脚 1 | Pin 1 | 器件方向定位基准 |
| 极性 | Polarity | 二极管、电解电容、LED 等方向属性 |
| 通孔 | Through Hole | 插件器件或贯穿孔 |
| 贴片 | SMD / SMT | 表面贴装器件或工艺 |
| 焊盘 | Pad | 焊接器件引脚的铜区域 |
| 焊膏层 | Paste Layer | 钢网开口使用的层 |
| Courtyard | Courtyard | 器件装配占位边界 |
| 3D 模型 | 3D Model | 用于机械检查的器件模型 |
| 替代料 | Alternative Part | 功能和封装兼容的备选器件 |
| MPN | Manufacturer Part Number | 厂商料号 |
| LCSC Part | LCSC 编号 | 立创商城器件编号 |

## 4. 电源术语

| 术语 | 英文 | 解释 |
| :--- | :--- | :--- |
| LDO | Low Dropout Regulator | 低压差线性稳压器 |
| DC-DC | Switching Regulator | 开关稳压器 |
| Buck | Step-down Converter | 降压转换器 |
| Boost | Step-up Converter | 升压转换器 |
| Buck-Boost | Buck-Boost Converter | 升降压转换器 |
| 纹波 | Ripple | 电源输出上的周期性波动 |
| 瞬态响应 | Transient Response | 负载变化时电源恢复能力 |
| 压差 | Dropout Voltage | LDO 输入输出最小压差 |
| 效率 | Efficiency | 输出功率与输入功率之比 |
| 静态电流 | Quiescent Current | 器件空闲时消耗的电流 |
| 使能 | Enable | 控制芯片开关的引脚 |
| 软启动 | Soft Start | 限制启动浪涌的功能 |
| 电源树 | Power Tree | 系统中各级电源转换关系 |
| 去耦 | Decoupling | 在芯片附近提供瞬态电流和降低噪声 |
| 旁路 | Bypass | 给高频噪声提供低阻抗路径 |
| 磁珠 | Ferrite Bead | 高频噪声抑制器件 |
| ESR | Equivalent Series Resistance | 电容等效串联电阻 |
| ESL | Equivalent Series Inductance | 电容等效串联电感 |

## 5. 接地、回流与噪声术语

| 术语 | 英文 | 解释 |
| :--- | :--- | :--- |
| 地 | Ground / GND | 电路参考点和电流返回路径 |
| 地平面 | Ground Plane | 大面积 GND 铜层 |
| 回流路径 | Return Path | 信号电流返回源端的路径 |
| 回路面积 | Loop Area | 正向路径和返回路径围成的面积 |
| 地弹 | Ground Bounce | 地电位因快速电流变化而跳动 |
| 共模噪声 | Common-mode Noise | 多根线相对于地同向变化的噪声 |
| 差模噪声 | Differential-mode Noise | 两根线之间的噪声 |
| 串扰 | Crosstalk | 相邻信号之间的耦合干扰 |
| 屏蔽 | Shielding | 用导体或结构降低干扰耦合 |
| 接地过孔 | Ground Via | 连接不同层 GND 的过孔 |
| 过孔栅栏 | Via Stitching / Via Fence | 用多颗 GND 过孔降低阻抗或隔离噪声 |

## 6. 信号完整性术语

| 术语 | 英文 | 解释 |
| :--- | :--- | :--- |
| 信号完整性 | Signal Integrity, SI | 信号能否以正确波形和时序到达 |
| 传输线 | Transmission Line | 走线长度相对边沿速度不可忽略的结构 |
| 特性阻抗 | Characteristic Impedance | 传输线本身的阻抗 |
| 反射 | Reflection | 阻抗不连续导致信号返回 |
| 端接 | Termination | 用电阻匹配或阻尼反射 |
| 源端串阻 | Series Termination | 在驱动端串联电阻减小振铃 |
| 过冲 | Overshoot | 信号超过目标高电平 |
| 下冲 | Undershoot | 信号低于目标低电平或地 |
| 振铃 | Ringing | 边沿后出现的震荡 |
| 抖动 | Jitter | 边沿时间的不稳定 |
| 偏斜 | Skew | 多根相关信号到达时间差 |
| 差分线 | Differential Pair | 用两根互补信号线传输 |
| 单端信号 | Single-ended Signal | 相对于地传输的单根信号 |
| 长度匹配 | Length Matching | 调整相关走线长度以控制时序差 |
| 蛇形线 | Meander | 为匹配长度而绕出的线形 |

## 7. EMC、ESD 与可靠性术语

| 术语 | 英文 | 解释 |
| :--- | :--- | :--- |
| EMI | Electromagnetic Interference | 电磁干扰发射 |
| EMC | Electromagnetic Compatibility | 电磁兼容，既不干扰别人也能抗干扰 |
| ESD | Electrostatic Discharge | 静电放电 |
| TVS | Transient Voltage Suppressor | 瞬态抑制二极管 |
| 浪涌 | Surge | 较大能量瞬态冲击 |
| EFT | Electrical Fast Transient | 电快速瞬变脉冲群 |
| 保险丝 | Fuse | 过流保护器件 |
| 自恢复保险丝 | PTC Fuse | 过流升温后阻值增大的保护器件 |
| 续流二极管 | Flyback Diode | 感性负载关断时释放能量的二极管 |
| RC 吸收 | RC Snubber | 抑制开关尖峰和振铃的 RC 网络 |
| 爬电距离 | Creepage | 沿绝缘表面的最短距离 |
| 电气间隙 | Clearance | 空气中的最短距离 |
| 降额 | Derating | 器件不按极限值使用，留可靠性余量 |

## 8. 调试与测量术语

| 术语 | 英文 | 解释 |
| :--- | :--- | :--- |
| 万用表 | Multimeter | 测电压、电流、电阻、通断 |
| 示波器 | Oscilloscope | 观察电压随时间变化 |
| 逻辑分析仪 | Logic Analyzer | 捕获数字信号时序 |
| 实验电源 | Bench Power Supply | 可调电压、电流限制的电源 |
| 限流 | Current Limit | 上电时限制最大电流 |
| 探头 | Probe | 示波器测量附件 |
| 地弹簧 | Ground Spring | 缩短探头接地路径的附件 |
| 测试点 | Test Point | 方便探针接触的焊盘或孔 |
| 热像仪 | Thermal Camera | 观察温度分布 |
| 复现 | Reproduce | 按步骤稳定重现问题 |
| 根因 | Root Cause | 真正导致问题的原因 |
| 临时修复 | Workaround | 暂时让系统工作的方法，不等于正式改版 |

## 9. EDA 与检查术语

| 术语 | 英文 | 解释 |
| :--- | :--- | :--- |
| ERC | Electrical Rule Check | 原理图电气规则检查 |
| DRC | Design Rule Check | PCB 设计规则检查 |
| Net Class | Net Class | 一组网络的统一规则 |
| Keepout | Keepout | 禁止布线或放置的区域 |
| Design Rule | Design Rule | 设计约束，如线宽、间距、过孔 |
| 反标注 | Back Annotation | 从 PCB 变化同步回原理图 |
| 正向标注 | Forward Annotation | 从原理图同步到 PCB |
| 封装库 | Footprint Library | 封装集合 |
| 符号库 | Symbol Library | 原理图符号集合 |
| 版本控制 | Version Control | 记录文件变更历史，如 Git |

## 10. 容易混淆的概念

| 概念 A | 概念 B | 区别 |
| :--- | :--- | :--- |
| 原理图正确 | PCB 可工作 | 原理图不包含布局、回流、噪声和制造细节 |
| DRC 通过 | 设计正确 | DRC 只检查规则，不判断电路功能 |
| GND 符号相同 | 回流路径合理 | 网络相同不代表物理路径短 |
| 去耦电容存在 | 去耦有效 | 位置和回路面积决定效果 |
| 板厂能做 | 适合量产 | 极限工艺可能成本高、良率低 |
| 频率低 | 没有高速问题 | 快速边沿也会带来 SI 和 EMI 问题 |
| 差分线等长 | 差分线合格 | 还要考虑阻抗、间距、参考平面和过孔 |
| 飞线修好 | 问题解决 | 飞线只是验证，正式版要改设计文件 |

## 本章总结

术语是硬件学习的索引。遇到不懂的英文词，不要只翻译字面意思，要回到它对应的物理含义、EDA 设置、板厂工艺或测试方法中理解。

## 参考与延伸阅读

- KiCad PCB Editor 文档：[https://docs.kicad.org/8.0/en/pcbnew/pcbnew.html](https://docs.kicad.org/8.0/en/pcbnew/pcbnew.html)
- JLCPCB PCB Capabilities：[https://jlcpcb.com/capabilities/pcb-capabilities](https://jlcpcb.com/capabilities/pcb-capabilities)
- IPC 标准入口：[https://www.ipc.org/meet-your-standards](https://www.ipc.org/meet-your-standards)
- Analog Devices 混合信号 PCB 布局指南：[https://www.analog.com/en/resources/analog-dialogue/articles/what-are-the-basic-guidelines-for-layout-design-of-mixed-signal-pcbs.html](https://www.analog.com/en/resources/analog-dialogue/articles/what-are-the-basic-guidelines-for-layout-design-of-mixed-signal-pcbs.html)
- TI PCB Design Guidelines For Reduced EMI：[https://www.ti.com/lit/an/szza009/szza009.pdf](https://www.ti.com/lit/an/szza009/szza009.pdf)
- PCB 设计返回路径 / 回流路径实践说明：[https://blog.csdn.net/weixin_45365488/article/details/134132810](https://blog.csdn.net/weixin_45365488/article/details/134132810)
