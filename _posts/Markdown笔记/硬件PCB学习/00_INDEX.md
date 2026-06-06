# 硬件与 PCB 详细学习笔记索引

这套笔记是对根目录 [HARDWARE_PCB_LEARNING_NOTES.md](HARDWARE_PCB_LEARNING_NOTES.md) 的逐章展开版。总纲负责建立知识地图，这个目录下的文件负责把每一章拆成更具体的学习内容、实操任务、检查清单和常见误区。

建议学习方式：

1. 先读总纲，知道整体路线。
2. 按编号阅读本目录中的详细笔记。
3. 每学完一章，完成对应练习。
4. 每做一个 PCB 项目，把相关章节的检查清单重新过一遍。
5. 不要跳过安全、电源、接地、调试这些基础内容。

## 学习顺序

| 编号 | 章节 | 文件 |
| :--- | :--- | :--- |
| 01 | 硬件学习到底学什么 | [01_WHAT_TO_LEARN.md](01_WHAT_TO_LEARN.md) |
| 02 | 新手学习路线总览 | [02_LEARNING_ROADMAP.md](02_LEARNING_ROADMAP.md) |
| 03 | 安全基础 | [03_SAFETY_BASICS.md](03_SAFETY_BASICS.md) |
| 04 | 数学与物理基础 | [04_MATH_PHYSICS_BASICS.md](04_MATH_PHYSICS_BASICS.md) |
| 05 | 电路基础 | [05_CIRCUIT_BASICS.md](05_CIRCUIT_BASICS.md) |
| 06 | 常见元器件 | [06_COMMON_COMPONENTS.md](06_COMMON_COMPONENTS.md) |
| 07 | 数据手册阅读 | [07_DATASHEET_READING.md](07_DATASHEET_READING.md) |
| 08 | 常用工具与仪器 | [08_TOOLS_AND_INSTRUMENTS.md](08_TOOLS_AND_INSTRUMENTS.md) |
| 09 | 原理图设计基础 | [09_SCHEMATIC_DESIGN.md](09_SCHEMATIC_DESIGN.md) |
| 10 | PCB 设计基础 | [10_PCB_DESIGN_BASICS.md](10_PCB_DESIGN_BASICS.md) |
| 11 | PCB 制造工艺基础 | [11_PCB_FABRICATION_BASICS.md](11_PCB_FABRICATION_BASICS.md) |
| 12 | PCB 层叠结构 | [12_PCB_STACKUP.md](12_PCB_STACKUP.md) |
| 13 | PCB 布局原则 | [13_PCB_PLACEMENT.md](13_PCB_PLACEMENT.md) |
| 14 | PCB 布线原则 | [14_PCB_ROUTING.md](14_PCB_ROUTING.md) |
| 15 | 电源设计基础 | [15_POWER_DESIGN.md](15_POWER_DESIGN.md) |
| 16 | 接地、回流路径与去耦 | [16_GROUNDING_RETURN_DECOUPLING.md](16_GROUNDING_RETURN_DECOUPLING.md) |
| 17 | 模拟电路设计基础 | [17_ANALOG_CIRCUITS.md](17_ANALOG_CIRCUITS.md) |
| 18 | 数字电路设计基础 | [18_DIGITAL_CIRCUITS.md](18_DIGITAL_CIRCUITS.md) |
| 19 | 单片机与嵌入式硬件 | [19_MCU_EMBEDDED_HARDWARE.md](19_MCU_EMBEDDED_HARDWARE.md) |
| 20 | 常见通信接口 | [20_COMMUNICATION_INTERFACES.md](20_COMMUNICATION_INTERFACES.md) |
| 21 | 传感器与执行器 | [21_SENSORS_ACTUATORS.md](21_SENSORS_ACTUATORS.md) |
| 22 | 电机、继电器和大电流负载 | [22_MOTORS_RELAYS_HIGH_CURRENT.md](22_MOTORS_RELAYS_HIGH_CURRENT.md) |
| 23 | 信号完整性基础 | [23_SIGNAL_INTEGRITY.md](23_SIGNAL_INTEGRITY.md) |
| 24 | 电源完整性基础 | [24_POWER_INTEGRITY.md](24_POWER_INTEGRITY.md) |
| 25 | EMI / EMC 基础 | [25_EMI_EMC.md](25_EMI_EMC.md) |
| 26 | 热设计基础 | [26_THERMAL_DESIGN.md](26_THERMAL_DESIGN.md) |
| 27 | DFM、DFA、DFT | [27_DFM_DFA_DFT.md](27_DFM_DFA_DFT.md) |
| 28 | 物料、封装和供应链 | [28_BOM_PACKAGES_SUPPLY.md](28_BOM_PACKAGES_SUPPLY.md) |
| 29 | 打样、焊接与装配 | [29_PROTOTYPING_SOLDERING_ASSEMBLY.md](29_PROTOTYPING_SOLDERING_ASSEMBLY.md) |
| 30 | 调试与故障排查 | [30_DEBUGGING_TROUBLESHOOTING.md](30_DEBUGGING_TROUBLESHOOTING.md) |
| 31 | 版本管理与硬件文档 | [31_VERSIONING_DOCUMENTATION.md](31_VERSIONING_DOCUMENTATION.md) |
| 32 | KiCad 学习重点 | [32_KICAD_LEARNING.md](32_KICAD_LEARNING.md) |
| 33 | 从 0 到 1 画一块 PCB 的完整流程 | [33_FULL_PCB_WORKFLOW.md](33_FULL_PCB_WORKFLOW.md) |
| 34 | 初学者推荐项目 | [34_BEGINNER_PROJECTS.md](34_BEGINNER_PROJECTS.md) |
| 35 | PCB 设计检查清单 | [35_PCB_CHECKLISTS.md](35_PCB_CHECKLISTS.md) |
| 36 | 常见错误 | [36_COMMON_MISTAKES.md](36_COMMON_MISTAKES.md) |
| 37 | 学习资料与参考链接 | [37_REFERENCES.md](37_REFERENCES.md) |

## 推荐节奏

| 阶段 | 建议时间 | 学习内容 | 产出 |
| :--- | :--- | :--- | :--- |
| 入门 | 1-2 周 | 01-08 | 能搭简单电路，会用基础工具 |
| 原理图与 PCB | 2-4 周 | 09-14 | 能画简单双层板 |
| 电源与系统 | 2-4 周 | 15-22 | 能做 MCU 小系统和接口板 |
| 工程进阶 | 4-8 周 | 23-30 | 能调试、处理噪声和可靠性问题 |
| 项目化 | 长期 | 31-37 | 能管理版本、打样、复盘和迭代 |

## 重要提醒

- 新手阶段只做低压直流电路，避免市电、高压、大功率和大容量电池。
- 每次上电前都要检查电源和地是否短路，并使用限流电源。
- 每个芯片都必须看数据手册，尤其是供电、电平、引脚、推荐原理图和布局建议。
- DRC/ERC 通过不代表板子一定能工作，它们只是基础规则检查。
- 硬件学习必须通过真实项目闭环，光看资料不够。
