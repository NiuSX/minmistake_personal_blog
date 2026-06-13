# 13. I/O、文件系统与序列化

## 标准流

C++ 标准流：

- `std::cin`：标准输入。
- `std::cout`：标准输出。
- `std::cerr`：标准错误。
- `std::clog`：日志输出。

```cpp
std::cout << "message\n";
std::cerr << "error\n";
```

## 文件读写

```cpp
#include <fstream>
#include <string>

std::ifstream input("data.txt");
std::string line;

while (std::getline(input, line)) {
    std::cout << line << '\n';
}
```

写文件：

```cpp
std::ofstream output("out.txt");
output << "hello\n";
```

检查打开是否成功：

```cpp
std::ifstream input("data.txt");
if (!input) {
    throw std::runtime_error("failed to open data.txt");
}
```

## 二进制文件

```cpp
std::ifstream input("data.bin", std::ios::binary);
```

二进制读写要注意：

- 字节序。
- 结构体内存布局。
- 对齐。
- 版本兼容。

不要直接把复杂对象内存写入文件作为通用序列化方案。

## stringstream

```cpp
#include <sstream>

std::istringstream input("1 2 3");
int a{}, b{}, c{};
input >> a >> b >> c;
```

拼接字符串：

```cpp
std::ostringstream out;
out << "id=" << id << ", name=" << name;
auto text = out.str();
```

## 格式化

C++20 提供 `std::format`：

```cpp
#include <format>

auto text = std::format("{} is {}", name, age);
```

C++23 引入 `std::print`，但编译器支持情况需要检查。

## filesystem

C++17 引入 `std::filesystem`：

```cpp
#include <filesystem>

namespace fs = std::filesystem;

fs::path path = "data.txt";

if (fs::exists(path)) {
    std::cout << fs::file_size(path) << '\n';
}
```

遍历目录：

```cpp
for (const auto& entry : fs::directory_iterator(".")) {
    std::cout << entry.path() << '\n';
}
```

递归遍历：

```cpp
for (const auto& entry : fs::recursive_directory_iterator(".")) {
    std::cout << entry.path() << '\n';
}
```

## 路径处理

```cpp
fs::path p = "/home/user/file.txt";

std::cout << p.filename() << '\n';
std::cout << p.extension() << '\n';
std::cout << p.parent_path() << '\n';
```

不要用字符串拼接路径：

```cpp
auto full = dir / "file.txt";
```

## 文本编码

C++ 标准库对文本编码处理能力有限。跨平台项目中要明确：

- 源文件编码。
- 文件内容编码。
- 命令行参数编码。
- Windows 路径编码。

常见建议：

- 源文件使用 UTF-8。
- 外部接口明确编码。
- Windows 下注意宽字符路径或现代工具链支持。

## 序列化

序列化是把对象转换成可存储或传输的格式。

常见格式：

- JSON：可读性好，适合配置和 Web。
- YAML：可读性强，适合配置，但解析复杂。
- XML：历史系统常见。
- Protobuf：高效，适合服务通信。
- MessagePack：二进制紧凑格式。

## JSON 示例思路

项目中通常使用第三方库，例如 nlohmann/json：

```cpp
// 示例思路，具体 API 以库文档为准
json user = {
    {"name", "Alice"},
    {"age", 20}
};
```

选择序列化库时看：

- 是否维护活跃。
- 是否支持目标标准。
- 性能是否满足需求。
- 错误处理是否清晰。
- 是否适合生产许可。

## I/O 建议

- 文件打开后检查状态。
- 明确文本和二进制模式。
- 使用 filesystem 处理路径。
- 不用字符串手动拼路径。
- 不直接序列化对象内存布局。
- 配置文件优先用清晰格式。
- 大文件读取注意内存和流式处理。

## 深入补充：流状态检查

文件打开和读取都要检查状态：

```cpp
std::ifstream input{"config.txt"};
if (!input) {
    throw std::runtime_error{"failed to open config.txt"};
}

for (std::string line; std::getline(input, line);) {
    // process line
}

if (input.bad()) {
    throw std::runtime_error{"I/O error while reading config.txt"};
}
```

`eof()` 不适合作为循环条件。更常见的写法是把读取操作本身作为条件。

## 深入补充：路径处理

使用 `std::filesystem::path` 拼接路径：

```cpp
namespace fs = std::filesystem;

fs::path root = "data";
fs::path file = root / "users.json";
```

不要手动用 `"/"` 或 `"\\"` 拼接路径。跨平台项目还要注意大小写敏感、权限、符号链接和当前工作目录。

## 深入补充：文本编码

C++ 标准库对文本编码的高级处理能力有限。工程中常见建议：

- 新项目统一使用 UTF-8。
- 明确文件是否带 BOM。
- Windows 控制台输出中文时注意终端编码。
- 网络协议和配置文件明确声明编码。
- 不要把“字符数量”和“字节数量”混为一谈。

`std::string` 本质是字节序列，不自动理解 Unicode 字符边界。

## 深入补充：不要直接序列化对象内存

下面这种方式很危险：

```cpp
output.write(reinterpret_cast<const char*>(&user), sizeof(user));
```

风险包括：

- 对象内存布局和填充字节不稳定。
- 指针值没有跨进程或跨机器意义。
- 大小端、对齐、版本升级都会出问题。
- 含有 `std::string`、`std::vector` 的对象不能这样持久化。

稳定的序列化应该显式写字段，并考虑版本兼容。

## 本章检查清单

- 是否会读写文本文件？
- 是否知道二进制序列化的风险？
- 是否会使用 filesystem 遍历目录？
- 是否知道路径不要手动字符串拼接？
- 是否能根据场景选择 JSON、Protobuf 等格式？

## 参考资料

- Reference: cppreference I/O library，https://cppreference.com/w/cpp/io
- Reference: cppreference filesystem library，https://cppreference.com/w/cpp/filesystem
- Reference: nlohmann/json GitHub，https://github.com/nlohmann/json
- Reference: Protocol Buffers C++，https://protobuf.dev/getting-started/cpptutorial/
