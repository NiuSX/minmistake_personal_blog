# 37 学习资料与参考链接

## 学习目标

学完本章，你应该能：

- 知道硬件和 PCB 学习应该优先看哪些资料。
- 区分官方文档、教程、论坛和视频的价值。
- 建立长期学习资料库。
- 知道如何用参考设计提高设计质量。

硬件学习资料很多，但质量差异大。优先看官方数据手册、应用笔记、参考设计和 EDA 官方文档。

## 1. 资料优先级

推荐优先级：

1. 芯片官方数据手册。
2. 官方应用笔记。
3. 官方评估板原理图和 PCB。
4. EDA 官方文档。
5. 板厂工艺说明。
6. 经典教材。
7. 高质量工程博客和论坛。
8. 视频教程。
9. 零散短视频和未经验证的图文。

不要把短视频当最终设计依据。

## 2. EDA 工具资料

KiCad：

- 官方文档：https://docs.kicad.org/
- KiCad 官网：https://www.kicad.org/
- PCB Editor 文档：https://docs.kicad.org/8.0/en/pcbnew/pcbnew.html

学习重点：

- Getting Started。
- Schematic Editor。
- PCB Editor。
- Footprint Libraries。
- Gerber Export。
- Board Setup、Design Rules、Net Classes、DRC。

立创 EDA：

- 官方帮助文档。
- 打样和贴片说明。
- 器件库说明。

Altium：

- 官方文档。
- Designer 规则和输出文档。

## 3. 芯片厂商资料

常见厂商：

- Texas Instruments
- STMicroelectronics
- Analog Devices
- Microchip
- NXP
- Espressif
- Nordic Semiconductor
- Infineon
- Onsemi

重点找：

- Datasheet。
- Application Note。
- Hardware Design Guide。
- Evaluation Board。
- Reference Design。
- Layout Guide。

## 4. MCU 学习资料

推荐关注：

- 官方参考手册。
- 数据手册。
- 硬件设计指南。
- 开发板原理图。
- 示例工程。

常见平台：

- Arduino：适合入门理解。
- ESP32：适合物联网。
- STM32：适合系统嵌入式学习。
- RP2040：文档友好。

## 5. PCB 工艺资料

板厂通常提供：

- 最小线宽线距。
- 最小孔径。
- 板厚。
- 铜厚。
- 阻焊桥。
- 拼板规则。
- Gerber 要求。
- 贴片文件要求。

每次下单前看板厂能力表。

常用入口：

- JLCPCB PCB Capabilities：https://jlcpcb.com/capabilities/pcb-capabilities
- 嘉立创 PCB 工艺能力说明：https://www.jlc.com/portal/vtechnology.html
- IPC 标准入口：https://www.ipc.org/meet-your-standards

## 6. 经典学习主题

基础：

- 电路分析。
- 模拟电子技术。
- 数字电子技术。
- PCB 设计基础。

进阶：

- 信号完整性。
- 电源完整性。
- EMC。
- 开关电源。
- 高速 PCB。
- 模拟前端。

## 7. 如何学习参考设计

参考设计学习步骤：

1. 看系统框图。
2. 看原理图模块。
3. 查关键芯片手册。
4. 对照典型应用。
5. 看 PCB 布局。
6. 观察去耦、电源、地、接口保护。
7. 总结可以复用的设计模式。

不要盲目复制。要理解为什么这样设计。

## 8. 如何建立资料库

建议目录：

```text
hardware_references/
  datasheets/
    mcu/
    power/
    sensors/
    interface/
  app_notes/
  reference_designs/
  pcb_fab/
  tutorials/
  standards/
```

文件命名：

```text
STM32F103_datasheet.pdf
AMS1117_datasheet.pdf
ESP32_hardware_design_guidelines.pdf
USB_TypeC_reference_design.pdf
```

## 9. 学习时如何做笔记

每读一个芯片数据手册，记录：

- 芯片用途。
- 供电范围。
- 最大电流。
- 引脚注意事项。
- 推荐外围。
- PCB 布局要求。
- 封装。
- 替代料。

每做一个项目，记录：

- 用了哪些资料。
- 哪些参考电路被采用。
- 哪些地方做了修改。
- 修改理由。

## 10. 常见参考链接

以下链接作为学习入口：

- KiCad 官方文档：https://docs.kicad.org/
- KiCad 官网：https://www.kicad.org/
- KiCad PCB Editor 文档：https://docs.kicad.org/8.0/en/pcbnew/pcbnew.html
- 嘉立创 EDA 专业版设计规则：https://prodocs.lceda.cn/cn/pcb/design-design-rule/
- 嘉立创 EDA 标准版 DRC：https://docs.lceda.cn/cn/PCB/Design-Rule-Check/
- IPC 标准入口：https://www.ipc.org/meet-your-standards
- Texas Instruments 技术资料入口：https://www.ti.com/lit/
- TI PCB Design Guidelines For Reduced EMI：https://www.ti.com/lit/an/szza009/szza009.pdf
- TI Practical PCB Design Rules：https://www.ti.com/lit/an/slaae45/slaae45.pdf
- TI 电机驱动器电路板布局的最佳实践：https://www.ti.com.cn/cn/lit/an/zhcaae6b/zhcaae6b.pdf
- ST 官方资源入口：https://www.st.com/content/st_com/en/support/learning.html
- Analog Devices 技术文章：https://www.analog.com/en/resources/technical-articles.html
- Analog Devices 混合信号 PCB 布局指南：https://www.analog.com/en/resources/analog-dialogue/articles/what-are-the-basic-guidelines-for-layout-design-of-mixed-signal-pcbs.html
- Espressif 文档：https://docs.espressif.com/
- Nordic 文档：https://docs.nordicsemi.com/
- JLCPCB PCB Capabilities：https://jlcpcb.com/capabilities/pcb-capabilities

中文实践资料：

- PCB 设计返回路径 / 回流路径实践说明：https://blog.csdn.net/weixin_45365488/article/details/134132810
- PCB Layout 布局布线 Checklist 通用版：https://www.cnblogs.com/shaobojiao/p/7940269.html
- 如何调试自己设计的 PCB 板：https://www.eet-china.com/mp/a17373.html
- 按照 5 个步骤调试 PCB：https://zhuanlan.zhihu.com/p/467704060

## 11. 推荐学习方法

不要只收藏资料。

正确方法：

1. 带着项目问题查资料。
2. 从官方资料找依据。
3. 做小实验验证。
4. 把结论写进项目笔记。
5. 下次设计复用自己的总结。

## 12. 判断资料可靠性

可靠性较高：

- 官方数据手册。
- 官方应用笔记。
- 官方评估板。
- 标准组织文档。
- 有实测数据的工程文章。

需要谨慎：

- 没有来源的电路图。
- 只说结论不解释条件的教程。
- 评论区复制来的参数。
- 没有测试的开源硬件。

## 实操练习

1. 为一个 LDO 建立资料卡片。
2. 下载一个 MCU 官方开发板原理图，分析电源和下载接口。
3. 找一个 DC-DC 芯片官方推荐布局，临摹其关键器件摆放。
4. 建立自己的 datasheets 文件夹。
5. 写一篇“我从参考设计学到了什么”的笔记。

## 检查清单

- 是否优先查官方资料？
- 是否保存了数据手册？
- 是否记录了关键参数？
- 是否看了参考布局？
- 是否验证了教程中的电路？
- 是否建立了自己的资料库？

## 常见误区

- 误区：收藏越多学得越多。
  纠正：真正有用的是阅读、实验和总结。

- 误区：开源硬件一定正确。
  纠正：也要检查原理图、PCB 和 issue。

- 误区：视频教程能替代数据手册。
  纠正：最终设计依据必须回到官方资料。

## 本章总结

硬件学习要建立资料判断能力。优先看官方数据手册、应用笔记和参考设计，再结合项目实验。好的资料库和笔记，会让你每做一块板都比上一块更稳。
