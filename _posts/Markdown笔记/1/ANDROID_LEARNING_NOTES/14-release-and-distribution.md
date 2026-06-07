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

