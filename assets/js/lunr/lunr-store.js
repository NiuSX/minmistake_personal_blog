var store = [{
        "title": "JSON",
        "excerpt":"简介 JSON，全称 JavaScript Object Notation（JavaScript 对象表示法）。 JSON 是一种用于存储和交换文本信息的语法，也是一种轻量级的文本交换格式。 JSON 具有自我描述性，易于阅读和编写。 JSON 独立于语言。虽然它使用 JavaScript 语法来描述数据对象，但许多编程语言都支持 JSON，例如 C、Python、C++、Java、PHP、Go 等。 JSON 文本格式在语法上与创建 JavaScript 对象的代码相似。由于这种相似性，JavaScript 程序可以使用内建的 eval() 函数，用 JSON 数据生成原生的 JavaScript 对象。不过在实际开发中，更推荐使用 JSON.parse() 来解析 JSON。 常用的 JSON 工具： JSON 格式化工具 JSON 转义/去除转义 JSON 在线解析工具 JSON 差异对比工具 JSON 语法 JSON 语法是 JavaScript 对象表示语法的子集。 数据以名称 /...","categories": ["标记语言"],
        "tags": [],
        "url": "/minmistake_personal_blog/JSON/",
        "teaser": null
      },{
        "title": "YAML语法",
        "excerpt":"介绍 YAML 最开始的全称是 “Yet Another Markup Language”（另一种标记语言）；后又更改为“YAML Ain’t a Markup Language”（YAML 不是一种标记语言）。 具体的演变过程： 最初（2001年）：YAML 的全称是 “Yet Another Markup Language”（另一种标记语言）。当时，它的确被构思为一种以数据序列化为主的标记语言。 后来：随着发展，YAML 的核心设计者意识到，它的主要用途是数据序列化（类似 JSON、XML 的数据承载），而不是给文本添加标记结构（像 HTML、Markdown 那样）。为了更准确地反映其用途，官方将名称改为递归缩写 “YAML Ain’t a Markup Language”（YAML 不是一种标记语言） YAML 的语法和其他高级语言类似，并且可以简单表达清单、散列表，标量等数据形态。它使用空白符号缩进和大量依赖外观的特色，特别适合用来表达或编辑数据结构、各种配置文件、倾印调试内容、文件大纲等 基本语法 大小写敏感 使用缩进表示层级关系 缩进不允许使用tab，只允许空格 缩进的空格数不重要，只要相同层层级的元素左对齐即可 #表示注释 :后面加空格 数据类型 YAML 支持以下几种数据类型： 对象：键值对的集合，又称为映射（mapping）/ 哈希（hashes） / 字典（dictionary） 数组：一组按次序排列的值，又称为序列（sequence） / 列表（list）...","categories": ["yaml","标记语言"],
        "tags": ["标记语言"],
        "url": "/minmistake_personal_blog/YAML/",
        "teaser": null
      },{
        "title": "HTML学习",
        "excerpt":"介绍 超文本标记语言（HTML，HyperText Markup Language）是一种用于创建网页的标准标记语言。 后缀名 .html 或者 .htm HTML 是用来描述网页的一种语言。 HTML 不是一种编程语言，而是一种标记语言，标记语言是一套标记标签 (markup tag) HTML 使用标记标签来描述网页 HTML 文档包含了HTML 标签及文本内容 HTML文档也叫做 web 页面 HTML 标记标签通常被称为 HTML 标签 (HTML tag)。 HTML 标签是由尖括号包围的关键词，比如&lt;html&gt; HTML 标签通常是成对出现的，比如&lt;b&gt; 和&lt;/b&gt; 标签对中的第一个标签是开始标签，第二个标签是结束标签 开始和结束标签也被称为开放标签和闭合标签 &lt;!DOCTYPE&gt; 声明有助于浏览器中正确显示网页;doctype 声明是不区分大小写的 1 2 3 4 &lt;!DOCTYPE html&gt; &lt;!DOCTYPE HTML&gt; &lt;!doctype html&gt; &lt;!Doctype Html&gt;...","categories": ["前端"],
        "tags": ["HTML"],
        "url": "/minmistake_personal_blog/HTML/",
        "teaser": null
      },{
        "title": "CSS学习",
        "excerpt":"简介 CSS （Cascading Style Sheets，层叠样式表），是一种用来为结构化文档（如 HTML 文档或 XML 应用）添加样式（字体、间距和颜色等）的计算机语言，CSS 文件扩展名为 .css。通过使用 CSS 我们可以大大提升网页开发的工作效率！ CSS 指层叠样式表 (Cascading Style Sheets) 样式定义如何显示 HTML 元素 样式通常存储在样式表中 把样式添加到 HTML 4.0 中，是为了解决内容与表现分离的问题 外部样式表可以极大提高工作效率 外部样式表通常存储在 CSS 文件中 多个样式定义可层叠为一个 语法 CSS规则由两个主要的部分构成：选择器，以及声明 h1 {color:bule;} h1 为选择器 color 为属性 bule 为值 注释 /*这是个注释*/ CSS 基础 选择器 CSS 选择器是一种模式匹配规则，用于选中 HTML 中的特定元素，并为这些元素应用样式。...","categories": ["前端"],
        "tags": ["CSS"],
        "url": "/minmistake_personal_blog/CSS/",
        "teaser": null
      },{
        "title": "cmake文件配置",
        "excerpt":"一、基础 1.基础语法 1.指定Cmake最低版本 1 cmake_minimum_required(VERSION 3.10) 2.定义项目的名称和使用的编程语言： 1 project(&lt;project_name&gt; [&lt;language&gt;...]) 3.指定要生成的可执行文件和其源文件： 1 add_executable(&lt;target&gt; &lt;source_files&gt;...) 4.创建一个库（静态库或动态库）及其源文件： 1 add_library(&lt;target&gt; &lt;source_files&gt;...) 5.链接目标文件与其他库： 1 target_link_libraries(&lt;target&gt; &lt;libraries&gt;...) 6.添加头文件搜索路径： 1 include_directories(&lt;dirs&gt;...) 7.设置变量的值： 1 set(&lt;variable&gt; &lt;value&gt;...) 8.设置目标属性： 1 2 3 4 target_include_directories(TARGET target_name [BEFORE | AFTER] [SYSTEM] [PUBLIC | PRIVATE | INTERFACE] [items1...]) 9.安装规则： 1 2 3...","categories": ["构建工具"],
        "tags": ["cmake"],
        "url": "/minmistake_personal_blog/Cmake/",
        "teaser": null
      },{
        "title": "uv包管理工具",
        "excerpt":"1.支持功能 包管理 完全替代pip的功能，支持包的安装、升级、卸载等操作 虚拟环境管理 内置虚拟环境创建和管理，无需额外安装virtualenv或venv 依赖解析与锁定 提供智能依赖解析算法并生成锁定文件uv.lock Python版本管理 能够自动安装和管理不同版本的Python解释器 项目初始化 通过uv init快速创建新项目并生成标准结构 脚本运行 支持在虚拟环境中直接运行脚本而无需手动激活环境 包发布 内置支持将项目打包并发布到PyPI等仓库 和传统pip的对比 特性 pip (传统) uv (现代) 速度 较慢 极快 (快10-100倍) 稳定性/兼容性 极其成熟，与所有生态完美兼容 较新，发展极快，兼容性已非常出色 项目依赖锁定 手动，脆弱 (requirements.txt) 自动化，稳健 (pyproject.toml + uv.lock) 环境管理 依赖外部工具 (venv) 内置，且能管理 Python 版本 单文件可执行 否 (依赖 Python) 是 (独立二进制文件，无需预装 Python) 学习曲线...","categories": ["python"],
        "tags": ["python","工具"],
        "url": "/minmistake_personal_blog/uv%E5%8C%85%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7/",
        "teaser": null
      },{
        "title": "xml学习(未完待续)",
        "excerpt":"介绍 XML 指可扩展标记语言（eXtensible Markup Language）。被设计用来传输和存储数据，不用于表现和展示数据，而HTML 则用来表现数据。是从标准通用标记语言（SGML）中简化修改出来的。它主要用到的有可扩展标记语言、可扩展样式语言（XSL）、XBRL和XPath等。 XML特点： ML 指可扩展标记语言（EXtensible Markup Language）。 XML 是一种很像HTML的标记语言。 XML 的设计宗旨是传输数据，而不是显示数据。 XML 标签没有被预定义。您需要自行定义标签。 XML 被设计为具有自我描述性。 XML 是 W3C 的推荐标准。 XML 是独立于软件和硬件的信息传输工具。 XML 和 HTML 区别： XML 不是 HTML 的替代。 XML 和 HTML 为不同的目的而设计： HTML 被设计用来显示数据，其焦点是数据的外观。XML 被设计用来传输和存储数据，其焦点是数据的内容。 HTML 旨在显示信息，而 XML 旨在传输信息。 HTML 中使用的标签都是预定义的。 HTML 中使用的标签都是预定义的。XML 语言没有预定义的标签； 允许创作者定义自己的标签和自己的文档结构...","categories": [],
        "tags": ["XML"],
        "url": "/minmistake_personal_blog/xml/",
        "teaser": null
      },{
        "title": "软件设计模式",
        "excerpt":"1. 设计七大原则 （SOLID LC） 1. 单一职责原则 (S) Single Responsibility Principle 一个类只负责一项职责 2. 接口隔离原则 （I） Interface Segregation Principle 客户端不应该被迫依赖于它不使用的方法；一个类对另一个类的依赖应该建立在最小的接口上。 3. 依赖倒转（倒置）原则（D） Dependence Inversion Principle 高模块不应该依赖低模块，二者都应该依赖其抽象 抽象不依赖细节，细节依赖抽象 倒置中心思想是面向接口编程 抽象稳定，细节多变，抽象指接口或抽象类，细节指具体的实现类 接口或抽象类是制定规范，不涉及具体操作，细节由实现类去完成 高层模块不应该依赖低层模块，两者都应该依赖其抽象；抽象不应该依赖细节，细节应该依赖抽象。简单的说就是要求对抽象进行编程，不要对实现进行编程，这样就降低了客户与实现模块间的耦合。 依赖关系传递方式： 接口传递 构造方法传递 setter方式传递 4. 里氏替换原则（L） Liskov Substitution Principle 继承性思考： 1.子类继承父类不破坏父类方法 2.继承带来弊端，程序耦合加强，父类修改，子类可能出现问题 介绍： 任何基类可以出现的地方，子类一定可以出现。通俗理解：子类可以扩展父类的功能，但不能改变父类原有的功能。换句话说，子类继承父类时，除添加新的方法完成新增功能外，尽量不要重写父类的方法。 1.引用基类的地方必须能透明使用子类对象 2.尽量不要重写父类方法 5. 开闭原则（O） Open Closed Principle...","categories": [],
        "tags": ["设计模式"],
        "url": "/minmistake_personal_blog/%E8%AE%BE%E8%AE%A1%E6%A8%A1%E5%BC%8F/",
        "teaser": null
      },{
        "title": "Nav2 笔记",
        "excerpt":"导航框架（Nav2） Nav2官网：https://docs.nav2.org/ Nav2中文网(鱼香Ros社区)：http://dev.nav2.fishros.com/ Nav2 基础配置指南：https://docs.nav2.org/configuration/index.html Nav2 细节配置指南：https://docs.nav2.org/tuning/index.html Nav2 默认插件列表及自定义插件教程： https://docs.nav2.org/plugins/index.html#plugins Nav2 API 文档(底层算法API)： https://api.nav2.org/ Nav2 Simple Commander API文档(上层应用API)：https://docs.nav2.org/commander_api/index.html Nav2 核心服务器 行为服务器：行为树执行 nav2框架的behavior_server 默认采用spin(旋转)和backup(后退)和drive_on_heading(定向行驶)和assisted_teleop(辅助遥控)和wait(等待)插件 行为树导航器: 导航状态机 规划器服务器：全局路径规划 nav2框架的controller_server 默认采用MPPIController控制器插件 控制器服务器：路径跟踪 nav2框架的planner_server 默认采用NavfnPlanner规划器插件 路径平滑服务器：na2框架的smoother_server 默认采用SimpleSmoother插件 速度平滑服务器：nav2框架的velocity_smoother 路由服务器：路径管理 nv2框架的route_server 默认采用AdjustSpeedLimit和ReroutingService和CollisionMonitor插件 航点跟随：多点导航 nav2框架的waypoint_follower 默认采用wait_at_waypoint插件 碰撞监视服务器：碰撞检测 nav2框架的collision_monitor 对接服务器：自动对接 nav2框架的docking_server 默认采用simple_charging_dock对接插件 用于充电桩，插座等的对接（未使用） 禁区导航服务器:在原本静态地图上添加掩膜地图，掩膜区域划分为禁止规划通行区域 速度限制导航服务器:在原本静态地图上添加掩膜地图，掩膜区域划分为速度限制区域，通过时会将速度限制在设定范围内低速前进。 建图（slam_toolbox） nav2...","categories": ["Nav2","导航","机器人","ROS2"],
        "tags": [],
        "url": "/minmistake_personal_blog/Nav2-%E7%AC%94%E8%AE%B0/",
        "teaser": null
      },{
        "title": "ROS常用指令表速查",
        "excerpt":"ROS2 常用指令速查表 1. 工作空间相关 命令 说明 mkdir -p ~/ros2_ws/src 创建工作空间目录 cd ~/ros2_ws &amp;&amp; colcon build 编译工作空间 colcon build --packages-select &lt;package_name&gt; 只编译指定功能包 colcon build --symlink-install 使用符号链接安装（方便 Python 节点开发） source ~/ros2_ws/install/setup.bash 激活环境 2. 功能包操作 命令 说明 ros2 pkg create &lt;package_name&gt; --build-type ament_cmake 创建 C++ 功能包 ros2 pkg create &lt;package_name&gt; --build-type ament_python 创建...","categories": ["机器人","ROS2"],
        "tags": [],
        "url": "/minmistake_personal_blog/ROS2%E5%B8%B8%E7%94%A8%E6%8C%87%E4%BB%A4%E8%A1%A8%E9%80%9F%E6%9F%A5/",
        "teaser": null
      },{
        "title": "ROS学习网站总结",
        "excerpt":"参考资料:   参考开源项目  HandsFree平台: https://github.com/HANDS-FREE ,最初由西北工业大学创建的一个开源机器人软硬件平台，后中科院，厦大等多个团队加入共同维护。   awesome-ros-mobile-robot：https://github.com/shannon112/awesome-ros-mobile-robot ,提供关于基于ROS的自主移动机器人（AMR）研究的有用资源和信息，网站链接，视频文本资料等。主要聚焦于移动机器人的基本功能（如里程计、SLAM、导航等）  Bot_Brain: https://github.com/botbotrobotics/BotBrain 是一个模块化的开源软件和硬件组件集合，让你可以通过一个简单但强大的网页界面，驾驶、观察、绘制地图、导航（手动或自主）、监控和管理有腿（四足、双足和类人）或轮式 ROS2 机器人,包含人工智能AI感知功能。   ArduPilot项目:https://github.com/ArduPilot/ardupilot ,ArduPilot 是最先进、功能最完善且最可靠的开源自动驾驶仪软件。能够控制几乎所有可想象的车辆系统，从传统飞机、四翼飞机、多旋翼机、直升机到漫游车、船只、平衡机器人，甚至潜艇。   论坛博客  蓝鲸智能机器人：https://community.bwbot.org/  蓝鲸智能机器人官方技术论坛   创客智造：https://www.ncnynl.com/  古月居： https://www.guyuehome.com/  全球中文地区领先的ROS机器人知识分享社区      鱼香ROS社区：https://fishros.org.cn/forum/   机器人 Web Tool   web tool: https://robotwebtools.github.io/   ROSbridge 协议(json对象)：https://github.com/RobotWebTools/rosbridge_suite/blob/ros2/ROSBRIDGE_PROTOCOL.md   建图及导航(Nav2)   Nav2官网：https://docs.nav2.org/    Nav2中文网(鱼香Ros社区)：http://dev.nav2.fishros.com/   Nav2 基础配置指南：https://docs.nav2.org/configuration/index.html   Nav2 细节配置指南：https://docs.nav2.org/tuning/index.html   Nav2 默认插件列表及自定义插件教程： https://docs.nav2.org/plugins/index.html#plugins   Nav2 API 文档(底层算法API)： https://api.nav2.org/    Nav2 Simple Commander API文档(上层应用API)：https://docs.nav2.org/commander_api/index.html   ","categories": ["机器人","ROS2"],
        "tags": [],
        "url": "/minmistake_personal_blog/ROS%E5%AD%A6%E4%B9%A0%E7%BD%91%E7%AB%99%E6%80%BB%E7%BB%93/",
        "teaser": null
      },{
        "title": "docker命令",
        "excerpt":"容器生命周期管理 1 2 3 4 5 6 7 8 9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 # 创建并启动一个新的容器 run # 这些命令主要用于启动、停止和重启容器 start/stop/restart # 立即终止一个或多个正在运行的容器 kill # 删除一个或多个已经停止的容器 rm # 暂停和恢复容器中的所有进程 pause/unpause # 创建一个新的容器，但不会启动它 create # 在运行中的容器内执行一个新的命令 exec # 重命名容器 rename 容器操作...","categories": [],
        "tags": ["docker"],
        "url": "/minmistake_personal_blog/docker%E5%91%BD%E4%BB%A4/",
        "teaser": null
      },{
        "title": "Kotlin学习",
        "excerpt":"介绍 Kotlin 是一种在 Java 虚拟机上运行的静态类型编程语言，被称之为 Android 世界的Swift，由 JetBrains 设计开发并开源。 Kotlin 可以编译成Java字节码，也可以编译成 JavaScript，方便在没有 JVM 的设备上运行。 在Google I/O 2017中，Google 宣布 Kotlin 成为 Android 官方开发语言。 优势： 简洁: 大大减少样板代码的数量。 安全: 避免空指针异常等整个类的错误。 互操作性: 充分利用 JVM、Android 和浏览器的现有库。 工具友好: 可用任何 Java IDE 或者使用命令行构建。 基础语法 包声明 package com.example.main 默认导入 otlin.* kotlin.annotation.* kotlin.collections.* kotlin.comparisons.* kotlin.io.* kotlin.ranges.* kotlin.sequences.* kotlin.text.* 函数定义...","categories": [],
        "tags": ["kotlin"],
        "url": "/minmistake_personal_blog/Kotlin%E5%AD%A6%E4%B9%A0/",
        "teaser": null
      },{
        "title": "java学习(未完待续)",
        "excerpt":"Java介绍 简介 java 是由 Sun Microsystems 公司于 1995 年 5 月推出的高级程序设计语言。 Java 可运行于多个平台，如 Windows, Mac OS 及其他多种 UNIX 版本的系统。 移动操作系统 Android 大部分的代码采用 Java 编程语言编程。 Java分为三个体系： JavaSE（J2SE）（Java2 Platform Standard Edition，java平台标准版） JavaEE(J2EE)(Java 2 Platform,Enterprise Edition，java平台企业版) JavaME(J2ME)(Java 2 Platform Micro Edition，java平台微型版)。 主要特性 Java 语言是简单的： Java 语言的语法与 C 语言和 C++ 语言很接近，使得大多数程序员很容易学习和使用。另一方面，Java 丢弃了 C++ 中很少使用的、很难理解的、令人迷惑的那些特性，如操作符重载、多继承、自动的强制类型转换。特别地，Java...","categories": ["编程语言"],
        "tags": [],
        "url": "/minmistake_personal_blog/java%E5%AD%A6%E4%B9%A0(%E6%9C%AA%E5%AE%8C%E5%BE%85%E7%BB%AD)/",
        "teaser": null
      },{
        "title": "PDDL规划语言",
        "excerpt":"概述 （PDDL,Planning Domain Deﬁnition Language） objects(对象) 世界中我们感兴趣的事物。 predicates(谓词) 我们感兴趣的对象属性；可以为真或假。 initial state(初始状态) 我们开始时的世界状态。 goal specification(目标规范) 我们希望成立的事物（即目标状态）。 action/operators(操作/运算符) 改变世界状态的方式。 PDDL指定的规划任务分为两个文件，domain 文件和 problem 文件。 A domain file（域文件） for predicates and actions. A problem file（问题文件） for objects, initial state and goal specification. domain：电视剧的剧本模板（人物设定、可以发生的情节类型） problem : 具体一集（这一集的初始情况、这一集要达成的目标） 1.Domain文件详解 1.基本框架： 1 2 3 4 5 6...","categories": ["AI"],
        "tags": ["PDDL","符号主义"],
        "url": "/minmistake_personal_blog/PPDL%E8%A7%84%E5%88%92%E8%AF%AD%E8%A8%80/",
        "teaser": null
      },{
        "title": "AI学习(一）- 基础",
        "excerpt":"概要 结构组成 目标：明确任务意图 逻辑：按规则拆成可执行步骤 工具：通过代码或API让步骤落地 运行方式： 接收输入 判断当前任务 调用对应工具执行 返回结果 保留必要上下文 支持多轮连续操作 遇阻时调整执行步骤 与普通大模型区别：普通大模型生成文本；Agent生成行动并执行行动，能完成实际工作 Agent架构图： 简介 核心组件 Agent=LLM(大脑)+Planning(规划)+Memory(记忆）+Tool use(工具使用) LPMT: LLM：作为核心推理机，负责理解意图、生成文本和进行逻辑判断。 Planning: 能够将复杂的目标（如”帮我策划一场技术沙龙”）拆解成可执行的步骤。 Memory: 记录对话历史（短期）和存储专业知识库（长期）。 Tool use: 能够根据需求去查谷歌搜索、读数据库、甚至跑 Python 代码。 Agent 与传统AI 模型区别： 维度 传统 AI 模型 AI Agent 交互方式 单次输入输出 多轮对话、持续交互 决策能力 基于输入直接推理 规划、反思、迭代优化 工具使用 无法主动调用外部工具 可调用搜索、计算器、API 等 记忆机制...","categories": ["AI"],
        "tags": [],
        "url": "/minmistake_personal_blog/AI%E5%AD%A6%E4%B9%A01-%E5%9F%BA%E7%A1%80/",
        "teaser": null
      },{
        "title": "AI学习(二）- MCP",
        "excerpt":"MCP入门 MCP，Model Context Protocol 模型上下文协议 MCP是一种开放的技术协议，旨在标准化大型语言模型（LLM）与外部工具和服务的交互方式。 无MCP的缺点： 第一是接口碎片化：每个LLM使用不同的指令格式，每个工具API也有独特的数据结构，开发者需要为每个组合编写定制化连接代码； 第二是开发低效，模型与工具深度绑定，无法构建统一生态系统，大大增加了迁移成本。 MCP则采用了一种通用语言格式（JSON - RPC），一次学习就能与所有支持这种协议的工具进行交流（JavaScript Object Notation—— Remote Procedure Call） MCP的特点 协议标准化 – 统一 JSON-RPC 2.0 消息格式，任何兼容 MCP 的主机（Claude Desktop、Cursor 等）都能即插即用。 本地优先 – 敏感数据留在本地，API 密钥不再暴露给模型提供商。 动态扩展 – 新增工具只需启动一个新的 MCP Server，无需改模型或主程序。 安全隔离 – 双层授权 + 最小权限 + 端到端加密。 MCP典型使用场景 场景 举例 MCP 的作用 个人...","categories": ["AI"],
        "tags": [],
        "url": "/minmistake_personal_blog/AI%E5%AD%A6%E4%B9%A02-MCP/",
        "teaser": null
      },{
        "title": "ollama安装",
        "excerpt":"安装 1.下载：访问 Ollama官网(https://ollama.com/)，点击 Download，选择Windows版本下载 .exe 安装包 2.安装：不建议双击安装(会默认安装在C盘) 在CMD里使用下面命令进行安装 cmd ./OllamaSetup.exe /DIR=\"D:\\Your\\Ollama\\Path\" 3.模型安装：在设置中选择模型安装路径更改模型安装路径 设置环境变量 设置环境变量(windows)打开系统设置里的环境变量 方法一： 1.点击编辑用户环境变量 2.编辑或为你的用户账户创建一个新的变量名 OLLAMA_MODELS，变量值为 D:\\你的模型目录 3.新建用户变量OLLAMA_HOST 值为本地监听地址：http://127.0.0.1:11434 4.点击确定/应用保存 方法二： 临时设置 set OLLAMA_MODELS=D:\\ollama_models 永久写入注册表 setx OLLAMA_MODELS D:\\ollama_models 注意： set 指令是临时设置，只在当前命令窗口下有用,但setx是永久设置保存到注册表中，和方法一是一样的 路径名中不要包含空格 启动 从Windows开始菜单启动Ollama应用程序 若是服务未启动，使用 ollama serve 启动服务 使用 ollama list不报错，证明服务启动成功 在浏览器里输入 localhost:11434 若是显示Ollama is running 则表示启动成功 下载模型...","categories": ["ollama","AI"],
        "tags": [],
        "url": "/minmistake_personal_blog/ollama%E5%AE%89%E8%A3%85/",
        "teaser": null
      },{
        "title": "AI学习(三）- RAG",
        "excerpt":"1.RAG入门 RAG，Retrieval-Augmented Generation，检索增强生成技术 RAG技术的落地主要由以下几个步骤组成： （1）文档的收集 （2）文档处理 （3）文档数据向量化 （4）文档数据相似性检索 （5）构建提示词 （6）大语言模型生成结果 RAG全栈技术框架： GraphRAG： GraphRAG（Graph-enhanced Retrieval-Augmented Generation） 是一种在经典 RAG 基础上引入知识图谱/图结构的新型检索生成方法 。其核心思想是通过将文档或数据转换成图的形式，从而捕捉实体与实体之间的语义关系，并在检索阶段利用图遍历、关系推理等机制来辅助上下文构建，这种结构化信息能够提升语义理解和多跳推理能力。 具体来说，GraphRAG 的流程包括： 图谱构建：将文本拆分为多个单元（TextUnit），提取实体与关系，构造知识图，并进行图社区检测与摘要； 混合检索：用户提问既可以进行向量检索定位实体，也可以通过图查询（如 Cypher/SPARQL）沿关系边扩展信息； 图增强生成：将检索到的节点、路径、社区摘要等信息拼接进 Prompt，引导 LLM 生成更准确、结构清晰、并基于事实推理的回答。 对比维度 传统 RAG GraphRAG 检索方式 基于向量语义相似度 向量+知识图遍历/查询 关系理解能力 弱：只能匹配语义相近片段 强：能理解实体之间的多跳关系与结构 多跳推理支持 弱：难以综合跨文档信息 强：图结构天然支持推理路径遍历 语义上下文覆盖 依赖检索片段 可检索完整实体子图、社区摘要 可解释性 中：返回片段但缺关键信息结构 高：能显示实体关系路径及社区结构 性能/复杂度 低：直接使用向量库 高：需要图构建、遍历、摘要等pipeline...","categories": ["AI"],
        "tags": [],
        "url": "/minmistake_personal_blog/AI%E5%AD%A6%E4%B9%A03-RAG/",
        "teaser": null
      },{
        "title": "AI学习(四）- Skills",
        "excerpt":"简介 介绍 Skills是Anthropic推出的模块化能力包系统，通过渐进式披露机制实现按需加载，大幅提升Token效率。 skills是模块化的能力包，包含指令、脚本和资源，可以让Claude在需要时自动加载和使用。 Skills是封装了特定技术任务的标准化可复用模块，本质是将技术场景中的最佳实践、工作流、工具调用逻辑，固化为可被AI Agent或开发工具一键加载、调用的配置单元（常见格式如skill.md、YAML配置）。其核心价值在于解决技术场景中的重复开发、流程不规范、Prompt调试繁琐三大痛点——不用你每次处理同类任务，都重复编写脚本、调试参数、梳理流程，加载对应Skill就能直接执行。 模块化：Skills是一个个独立的文件夹，每个Skill做一件事 能力包： 每个Skill文件夹里可以包含： SKILL.md（核心指令文件，必需） scripts/（可执行脚本，可选） references/（参考文档，可选） assets/（模板和资源，可选） 自动加载 Claude会根据你的任务描述，自动判断需要哪个Skill，然后加载 不使用skills时需要审校文章时： 1 2 “帮我审校这篇文章。注意检查事实准确性，去掉AI味的表达，比如’不是…而是…'这种套话， 把长句拆成短句，段落不要太长，像手机屏幕3-5行这样，加粗不要太多，每200-300字1-2处就够了，还要检查是否像真人在说话…” 使用skill时,提前把规则写到skill里，会自动识别： 1 “帮我审校这篇文章” 渐进式披露机制 渐进式披露机制：（Progressive Disclosure）是 Skills 系统的核心设计思想，简单来说就是： AI Agent 先只看”目录”，确定需要后，再加载完整”章节”。是一种按需加载知识的策略，目的是解决 AI 模型的”上下文窗口有限”这个根本瓶颈。 说白了就是只给 Agent 看 Skills 的名字和简短描述（几十 tokens）上下文清爽；Agent 快速判断需要哪个 Skill；然后 按需加载完整内容 渐进式披露机制分为三级： 第一级别 元数据： 启动时加载，只需要skills名称和一句话描述，消耗几十token，让Claude知道有哪些Skills可用，什么时候该用哪个。 内容：SKILL.md文件开头的YAML部分，就两个字段：name和description。 1 2 3...","categories": ["AI"],
        "tags": [],
        "url": "/minmistake_personal_blog/AI%E5%AD%A6%E4%B9%A04-Skills/",
        "teaser": null
      },{
        "title": "Android 学习",
        "excerpt":"简介 Android是一个开源的，基于Linux的移动设备操作系统，主要使用于移动设备，如智能手机和平板电脑。Android是由谷歌及其他公司带领的开放手机联盟开发的。 架构 Android 操作系统是一个软件组件的栈，在架构图中它大致可以分为五个部分和四个主要层。 分别为应用层、应用框架层、系统运行层（原生库和 Android 运行时）、Linux内核层 应用层： 核心作用：面向用户的最终产品。 组成： 系统应用：电话、联系人、短信、设置、浏览器等。 第三方应用：开发者利用框架层 API 开发的各类 App。 应用框架层：为开发者直接提供服务的基础框架。 核心作用：提供开发 Android 应用所需的各种 API。 主要管理器： Activity Manager：管理应用生命周期和活动栈。 Window Manager：管理窗口和界面布局。 Content Providers：实现应用间的数据共享。 View System：构建用户界面的控件集（如 Button、TextView） Notification Manager：管理状态栏通知。 Package Manager：管理应用的安装、卸载和权限。 系统运行层 原生库 内容：用 C/C++ 编写，支撑 Android 系统运行的底层库。 关键库： WebKit/Chromium：浏览器内核。 OpenGL ES &amp; Vulkan：图形渲染库。 SQLite：轻量级关系型数据库。 Media...","categories": ["-Android"],
        "tags": [],
        "url": "/minmistake_personal_blog/Android%E5%AD%A6%E4%B9%A0/",
        "teaser": null
      },{
        "title": "Gradle构建工具",
        "excerpt":"gradle基础 介绍 Gradle 是一个基于 Apache Ant 和 Apache Maven 概念的项目自动化构建工具。它使用一种基于 Groovy 或 Kotlin 的特定领域语言(DSL)来声明项目配置，而不是传统的 XML。 Gradle 构建工具是一款快速、可靠且适应性的开源构建自动化工具，采用优雅且可扩展的声明式构建语言 Gradle 支持 Android、Java、Kotlin 多平台、Groovy、Scala、Javascript 和 C/C++。 主要特点： 灵活且高性能的构建工具 支持多项目构建 强大的依赖管理 支持增量构建 丰富的插件生态系统 与 Maven 和 Ivy 仓库兼容 核心概念 Gradle 通过构建脚本中的信息自动化软件的构建、测试和部署。 Gradle 构建以项目和任务为定义，使用用 Groovy 或 Kotlin 编写的构建脚本进行配置。 概念 建造： 产出过程和环境。构建包含一个或多个项目及其构建脚本。 项目：一个可以构建的软件，比如应用程序或库。一个构建可以包含单个根项目或多个子项目。 任务：一个基本的工作单元，比如编译代码或运行测试。任务可以在构建脚本中声明，或由插件添加。 构建脚本：一个配置文件（），定义任务、依赖以及其他指示Gradle如何构建项目的指令。build.gradle(.kts) 插件：用来扩展...","categories": ["构建工具"],
        "tags": [],
        "url": "/minmistake_personal_blog/gradle%E6%9E%84%E5%BB%BA%E5%B7%A5%E5%85%B7/",
        "teaser": null
      },{
        "title": "RestFulAPI",
        "excerpt":"介绍 Rest架构风格 REST（Representational State Transfer，表述性状态转移）是一种软件架构风格，由 Roy Fielding 博士在 2000 年提出，REST 定义了一组约束条件和原则，用于创建可扩展、松耦合的 Web 服务。 它是一种针对网络应用的设计和开发方式，可以降低开发的复杂性，提高系统的可伸缩性。 六大原则 客户端-服务器架构:前端（客户端）和后端（服务器）完全分离. 无状态性:每次请求都是独立的，服务器不会记住之前的请求。 可缓存性: 响应数据可以被缓存，提高性能。 统一接口:所有 API 都遵循相同的规则和格式,统一接口为REST定义了对系统资源进行操作统一的方法和链接入口，REST架构的核心就是资源，它将互联网中所有的可访问、操作的数据信息都看作资源进行处理，从而简化了REST对不同数据信息的处理方式和过程，也为REST的高度 重用性以及不同分布式异构系统的高交互性奠定了基础 分层系统:系统可以有多层，比如：客户端 → 负载均衡器 → API 服务器 → 数据库，分层系统的定义使得web Service的定义和实现Web系 统不同的层次之间具有良好的独立性，从而降低了系统层次依赖耦合性和复杂性，而良好的接口封装、应用功能实现等干扰性大大降低，从而为Web系统的可维护性、扩展性等奠定了良好的基础。 按需代码（可选）:服务器可以向客户端发送可执行代码，按需代码则是web Service可选的要求，通过按需代码开发者可以在客户端的应用程序进行功能扩展，从而实现对客户需求的满足，从而使得系统更加人性化，提升其友好性。 API介绍 API（Application Programming Interface，应用程序编程接口）就像是不同软件之间的”翻译官”。 在编程世界中，API 让不同的软件系统能够相互交流和协作。 API 的主要作用包括： 数据交换：让不同系统之间能够传递信息 功能复用：避免重复造轮子，使用现成的服务 系统解耦：让前端和后端可以独立开发 安全控制：控制谁可以访问什么数据 RESTful API REST...","categories": ["架构"],
        "tags": [],
        "url": "/minmistake_personal_blog/RestFulAPI/",
        "teaser": null
      },{
        "title": "Shell语言",
        "excerpt":"介绍 Shell 是一个用 C 语言编写的程序，它是用户使用 Linux 的桥梁。Shell 既是一种命令语言，又是一种程序设计语言。 Shell 是指一种应用程序，这个应用程序提供了一个界面，用户通过这个界面访问操作系统内核的服务。 Shell 脚本（shell script），是一种为 shell 编写的脚本程序。 shell 环境： Shell 编程跟 JavaScript、php 编程一样，只要有一个能编写代码的文本编辑器和一个能解释执行的脚本解释器就可以了。 Linux 的 Shell 种类众多，常见的有： Bourne Shell（/usr/bin/sh或/bin/sh） Bourne Again Shell（/bin/bash） C Shell（/usr/bin/csh） K Shell（/usr/bin/ksh） Shell for Root（/sbin/sh） …… 由于易用和免费，Bash 在日常工作中被广泛使用。同时，Bash 也是大多数Linux 系统默认的 Shell。 在一般情况下，人们并不区分 Bourne Shell 和 Bourne Again Shell，所以，像...","categories": ["命令语言","编程语言"],
        "tags": [],
        "url": "/minmistake_personal_blog/Shell/",
        "teaser": null
      },{
        "title": "KMP 多平台项目配置(未完待续）",
        "excerpt":"介绍 Kotlin 多平台（KMP，Kotlin Multiplatform）是 JetBrains 的一项开源技术，采用”共享代码、原生实现”的架构理念，能够在 Android、iOS、桌面、网页和服务器之间共享代码，同时保留原生开发的优势。与传统的”一次编写，到处运行”虚拟机方案不同，Kotlin Multiplatform通过LLVM编译器直接将共享代码分别编译为目标平台的原生代码，确保了与平台SDK的深度集成和最优性能，实现了代码复用性与原生性能的完美平衡 同时你还可以通过 Compose Multiplatform，在多个平台共享 UI 代码，最大化代码的重复使用。 官方教程 核心优势 代码共享最大化：业务逻辑、数据模型、网络层等核心代码100%共享 原生性能：直接编译为平台原生代码，无中间虚拟机开销 平台特性访问：通过预期声明（Expect/Actual）机制无缝调用平台API 类型安全：全平台统一的类型系统，编译时捕获跨平台兼容性问题 工具链集成：与Android Studio和Xcode深度集成，提供一流开发体验 工具使用： IntelliJ IDEA 和 Android Studio 为 KMP 提供了智能 IDE 支持，包含 Kotlin 多平台 IDE 插件、通用界面预览、Compose 多平台热重载、跨语言导航、重构以及跨 Kotlin 和 Swift 代码的调试 项目架构最佳实践 推荐的模块结构 一个典型的KMP项目应包含以下模块结构，这种结构既能最大化代码共享，又能清晰分离平台特定代码： 1 2 3 4 5 6...","categories": ["Kotlin"],
        "tags": [],
        "url": "/minmistake_personal_blog/KMP%E5%A4%9A%E5%B9%B3%E5%8F%B0%E9%A1%B9%E7%9B%AE%E9%85%8D%E7%BD%AE/",
        "teaser": null
      },{
        "title": "AI学习(五）- HarnessEngineering(未完待续)",
        "excerpt":"介绍 一个Agent = Model + Harness，所有Harness Engineering 指的是模型之外的一切，包含系统提示词，工具调用，文件系统，编排逻辑，钩子中间件、反馈回路、约束机制等等。model是Agent的能力来源，而 Harness 则把状态、工具、反馈和约束串起来。 Harness Engineering 和 Prompt 以及 Context Enginering 三者之间是嵌套关系，每一层解决不同的问题。Harness Engineering 包含 Context Enginering 包含 Prompt Enginering Harness Engineering 解决的是执行问题，负责长链路任务中持续做对，不跑偏，犯错能更正，包含文件系统，约束执行，反馈回路，沙箱等等 Context Enginering 则解决的是信息问题，负责确保模型在合适时机拿到正确且必要的事实信息。包含上下文管理，RAG,记忆注入，Token优化等等 Prompt Enginering 则解决的是表达问题,确保让模型听懂需求，包括系统提示词，思维链引导等。 注：在简单任务里，提示词最重要；依赖外部知识的任务里，上下文重要；长链路的商业应用中，Harness 重要 Harness Engineering 包含记忆系统，执行环境，外部知识获取，文件系统，验证闭环，上下文管理。 一个完整的 HarnessEngineering 包含六层体系： 信息边界层： 角色目标定义，信息隔离，Agents.md规范 确保AI该知道什么，不该知道什么 工具系统层：文件系统抽象，bansh执行环境，MCP 工具挂载 确保Agent 如何跟外部世界交互 执行编排层：多步骤任务串联，混合状态机编排...","categories": ["AI"],
        "tags": [],
        "url": "/minmistake_personal_blog/AI%E5%AD%A6%E4%B9%A05-Harness/",
        "teaser": null
      },{
        "title": "AI 编程工具使用",
        "excerpt":"Gemin 使用 1. AndroidStudio 和 IDEA 使用（最简单） AndroidStudio 和 IDEA 里集成了 Gemin 插件，可直接登录使用 ，深度集成。 注意：插件升级到最新版，旧版和 IDE有兼容问题，用起来会有各种问题，最新更新应该是修复了 2. gemini CLI 使用 需要提前安装 Node.js 和 npm 安装 CLI ` npm install -g @google/gemini-cli` 安装完成后在命令行输入 gemini 按照指示选择配置风格及登录方式 设置代理 注：gemini CLI 没有单独设置代理的配置文件 需要在系统环境变量里设置全局代理。 配置完成后即可在命令行使用 命令 使用 gemini，gemini--help 查看命令 完成后就可以终端里使用命令行操作 注：有基础免费额度使用，限制每分钟 60次，每天1000次 codex 使用 codex...","categories": ["AI 工具"],
        "tags": [],
        "url": "/minmistake_personal_blog/AI%E7%BC%96%E7%A8%8B%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8/",
        "teaser": null
      },{
        "title": "AI编程范式浅了解",
        "excerpt":"介绍 编程语言的发展从最早的机器语言到汇编语言，再到众多高级语言，随着AI的发展，迎来了新的革命。2025年2月Andrej Karpathy 提出了vibe coding 的概念，但是由于上下文缺失，迭代混乱等局限性引发了编程社区的反思，在之后提出了spec coding 的新范式，将AI编程发展到规范化，工程化的轨道上。 vibe coding vibe coding，氛围式编程，即使用自然语言来完成代码编写。通过自然语言描述需求，AI生成可运行的代码。当输出不符合预期时，用户根据反馈调整 prompt，进行迭代优化，直到解决问题为止，整个过程只用 说想法 -&gt; 看结果 -&gt; 做调整 -&gt;看结果，用户的核心关注点只在结果对不对，而不必关注实现逻辑，底层代码等，全称只用进行表层自然语言交互就行。开发路径只有简单的两步 想法 -&gt; 代码 优势： 门槛极低，无需懂编程语言，非技术人员极易上手 效率极高 劣势： 代码质量 架构困难，代码可维护性差 大型项目困难 上下文漂移 AI 幻觉不易发现 风险与速度并存 适用场景： 产品原型快速验证 非技术人员使用 spec coding 为了克服 vibe coding 的随意不可控性，出现了spec coding，可以理解为vibe coding 的规范化，工程化。技术人员在对AI添加一定的约束条件下保证AI能够更加精准的深度的理解项目的需求，架构，业务等等，生成出更高效更完善更可控的代码项目。 sepc coding 主要是基于 Harnessing Engineer(驾驭工程)...","categories": ["AI"],
        "tags": [],
        "url": "/minmistake_personal_blog/AI%E7%BC%96%E7%A8%8B%E8%8C%83%E5%BC%8F%E4%BA%86%E8%A7%A3/",
        "teaser": null
      },{
        "title": "Spec-kit使用教程",
        "excerpt":"Spec- Kit spec-kit github 官方开发维护的一个 SDD 工具 1. 安装 需要先安装 Python 包管理工具 uv： 1 powershell -ExecutionPolicy ByPass -c \"irm https://astral.sh/uv/install.ps1 | iex\" 安装 spec-kit 工具。 X.Y.Z为版本 1 uv tool install specify-cli --from git+https://github.com/github/spec-kit.git@vX.Y.Z 检查你安装的工具 1 specify check 2. 使用 1. 初始化项目 创建新项目，会弹出选择框选择你需要用到的 AI 工具 1 specify init &lt;PROJECT_NAME&gt; 如果项目已经存在 1...","categories": ["AI","SDD"],
        "tags": [],
        "url": "/minmistake_personal_blog/Spec-Kit%E4%BD%BF%E7%94%A8%E6%95%99%E7%A8%8B/",
        "teaser": null
      }]
