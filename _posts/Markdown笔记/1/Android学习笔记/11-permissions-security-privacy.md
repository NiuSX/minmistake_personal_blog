# 11. 权限、安全与隐私

## 权限原则

Android 权限应遵循最小权限原则：

- 只申请真正需要的权限。
- 在用户触发相关功能时再申请。
- 清楚解释权限用途。
- 权限被拒绝时提供降级体验。

常见权限：

- 网络访问。
- 相机。
- 麦克风。
- 定位。
- 存储或媒体访问。
- 通知。
- 蓝牙。

## 运行时权限

危险权限需要运行时申请。Compose 中通常结合 Activity Result API。

思路：

```kotlin
val launcher = rememberLauncherForActivityResult(
    contract = ActivityResultContracts.RequestPermission()
) { granted ->
    if (granted) {
        // continue
    } else {
        // show fallback
    }
}
```

不要在应用启动时一次性申请大量权限。

## exported 组件

Manifest 中组件是否暴露给其他应用由 `android:exported` 控制。

建议：

- 不需要外部访问的 Activity、Service、Receiver 设置为 false。
- 对外暴露组件要校验输入。
- 避免导出敏感功能。

## 网络安全

建议：

- 使用 HTTPS。
- 不在生产环境允许明文流量。
- 校验证书。
- 不把 token 写入日志。
- API 错误不要暴露敏感内部信息。

网络安全配置：

```xml
<network-security-config>
    <base-config cleartextTrafficPermitted="false" />
</network-security-config>
```

## 本地数据安全

敏感数据：

- token。
- 个人身份信息。
- 支付信息。
- 定位信息。

处理建议：

- 不保存不必要数据。
- 必要时加密。
- 使用 Android Keystore 管理密钥。
- 日志脱敏。
- 崩溃上报脱敏。

## WebView 安全

WebView 风险较高。

建议：

- 不随意开启 JavaScript。
- 不加载不可信 URL。
- 谨慎使用 `addJavascriptInterface`。
- 限制文件访问。
- 处理 URL 跳转。

## 输入校验

所有外部输入都不可信：

- Intent 参数。
- Deep Link。
- 网络响应。
- 用户输入。
- 文件内容。
- WebView 消息。

校验类型、范围和权限。

## 隐私合规

应用应明确：

- 收集什么数据。
- 为什么收集。
- 如何使用。
- 是否共享给第三方。
- 用户如何撤回或删除。

隐私合规不是只写隐私政策，还包括代码和数据流程本身。

## 安全检查清单

- 是否只申请必要权限？
- 是否正确处理权限拒绝？
- 是否避免导出不必要组件？
- 是否禁用生产明文流量？
- 是否避免日志输出敏感信息？
- 是否对 Deep Link 和 Intent 输入做校验？
- 是否对本地敏感数据加密？

