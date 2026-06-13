# 14. 打包、签名与发布

## APK 与 AAB

APK 是 Android 安装包。

AAB 是 Android App Bundle，Google Play 推荐使用。它允许平台按设备生成更合适的 APK，减少下载体积。

## Debug 与 Release

Debug：

- 可调试。
- 使用 debug 签名。
- 不适合发布。

Release：

- 用正式签名。
- 通常启用 R8。
- 需要完整测试。

## 应用签名

Android 应用必须签名。

Release 签名需要妥善保管：

- keystore。
- key alias。
- key password。
- store password。

不要把正式签名信息提交到仓库。

## 版本号

```kotlin
defaultConfig {
    versionCode = 2
    versionName = "1.1.0"
}
```

- `versionCode`：整数，发布新版本必须递增。
- `versionName`：展示给用户看的版本号。

## R8 与混淆

Release 中常启用：

```kotlin
buildTypes {
    release {
        isMinifyEnabled = true
        proguardFiles(
            getDefaultProguardFile("proguard-android-optimize.txt"),
            "proguard-rules.pro"
        )
    }
}
```

作用：

- 删除无用代码。
- 优化字节码。
- 混淆名称。
- 减小体积。

注意第三方库可能需要 keep 规则。

## 资源压缩

```kotlin
isShrinkResources = true
```

通常需要和 R8 一起使用。

## 构建变体

发布前要确认：

- API Base URL。
- 日志开关。
- 调试入口。
- 测试账号。
- 埋点配置。
- 隐私政策。
- 第三方 SDK 配置。

不要把 dev 环境配置打进 release。

## 发布前检查

- 版本号递增。
- Release 构建成功。
- 签名正确。
- R8 后功能正常。
- 关键流程测试通过。
- 权限声明合理。
- 隐私政策完整。
- 崩溃分析已接入。
- 性能和启动可接受。
- 多设备和多系统版本验证。

## Google Play 发布关注点

通常需要：

- 应用名称和描述。
- 图标和截图。
- 内容分级。
- 隐私政策。
- 数据安全表单。
- 目标 SDK 符合要求。
- AAB 包。

具体要求会变化，应以 Google Play Console 当前规则为准。

## 灰度与回滚

建议：

- 先内部测试。
- 再小流量灰度。
- 观察崩溃和关键指标。
- 逐步扩大发布。

Android 应用无法像服务端一样完全即时回滚，因此发布前测试和灰度很重要。

## 本章检查清单

- 是否知道 APK 和 AAB 的区别？
- 是否理解 versionCode 必须递增？
- 是否知道 release 签名要保密？
- 是否知道 R8 可能需要 keep 规则？
- 是否有发布前检查清单？

## 发布产物

| 产物 | 用途 | 说明 |
| --- | --- | --- |
| APK | 直接安装、内部测试、部分渠道 | 包含目标设备需要的所有资源和代码 |
| AAB | Google Play 推荐发布格式 | Play 根据设备生成优化 APK |
| Mapping 文件 | 崩溃符号还原 | 每个 release 版本必须保存 |
| Native symbols | NDK 崩溃符号还原 | 使用 C/C++ 时需要上传 |

发布到 Google Play 通常使用 AAB。国内多渠道分发仍可能需要 APK 或渠道包。

## 版本号规则

`versionCode` 是机器可比较的递增整数，发布新版本必须比旧版本大。

`versionName` 是给用户看的版本名，例如 `1.4.2`。

建议：

```kotlin
android {
    defaultConfig {
        versionCode = 10402
        versionName = "1.4.2"
    }
}
```

可以约定 `major * 10000 + minor * 100 + patch`，但要确保长期不会溢出或冲突。

## R8 与 keep 规则

R8 会做：

- 代码压缩。
- 资源压缩。
- 优化。
- 混淆。

常见需要 keep 的情况：

- 反射创建的类。
- 序列化框架特殊字段。
- WebView JavaScript Interface。
- 第三方 SDK 要求。
- JNI 方法。

原则：先使用库官方给出的规则，再基于 release 构建和崩溃日志补充，不要用过宽的 `-keep class ** { *; }` 直接放弃优化。

## 发布前检查清单

- `./gradlew test` 通过。
- 关键设备 UI 测试通过。
- Release 包可安装、可登录、核心流程可用。
- 版本号递增。
- 签名配置正确且密钥安全。
- R8 mapping 文件已归档。
- 崩溃、ANR、日志、埋点配置已接入。
- 隐私政策、权限说明、数据安全表单与代码一致。
- 不包含调试菜单、测试地址、测试账号、明文密钥。
- targetSdk 满足目标渠道当前要求。

## 灰度发布观察指标

灰度不是只看有没有崩溃。至少观察：

- Crash-free users。
- ANR 率。
- 登录成功率。
- 首页加载耗时。
- API 错误率。
- 支付、下单、同步等关键路径成功率。
- 用户反馈和客服问题。

发现严重问题时，优先暂停扩大灰度。移动端无法像服务端一样瞬间回滚所有用户，因此发布节奏要保守。

## 渠道和合规差异

不同渠道可能有不同要求：

- Google Play：AAB、target API、数据安全、内容政策。
- 国内应用商店：软著、隐私检测、权限说明、SDK 合规、加固要求。
- 企业内部分发：签名、MDM、安装来源和更新策略。

发布前以目标渠道当前后台要求为准，不要只依赖旧笔记。
