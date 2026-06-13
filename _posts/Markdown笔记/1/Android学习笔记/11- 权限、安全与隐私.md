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

## 权限分类与申请原则

权限设计原则：只在需要时申请，只申请完成当前功能所需的最小权限。

| 权限类型 | 示例 | 处理方式 |
| --- | --- | --- |
| 普通权限 | 网络访问 | 安装时授予，无需运行时弹窗 |
| 危险权限 | 定位、相机、麦克风、联系人 | 运行时申请，处理拒绝 |
| 特殊权限 | 悬浮窗、无障碍、精确闹钟 | 跳系统设置或特殊授权流程 |
| 媒体 / 通知相关权限 | 通知、照片访问 | 关注 Android 版本差异 |

不要在 App 首次启动就批量申请权限。更好的方式是在用户触发具体功能时说明用途并申请。

## 运行时权限状态

权限申请至少要处理：

- 已授权。
- 拒绝。
- 拒绝且不再询问。
- 只授权部分媒体或近似位置。
- 系统版本不需要该权限。

Compose 中可以把权限状态建模成 UI State，而不是在按钮回调里到处写分支。

## exported 与组件暴露

所有可被外部启动的组件都应明确审查：

```xml
<activity
    android:name=".DeepLinkActivity"
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="https" android:host="example.com" />
    </intent-filter>
</activity>
```

如果组件不需要被其他应用调用，应设为：

```xml
android:exported="false"
```

对外暴露组件必须校验 Intent 参数、调用来源和业务权限。

## 网络安全

生产环境建议：

- 默认使用 HTTPS。
- 禁止明文 HTTP，除非有明确白名单。
- 证书错误不要用“信任所有证书”绕过。
- 日志中不要打印 token、cookie、身份证、手机号、定位。
- WebView 开启 JavaScript Bridge 时必须限制来源和接口能力。

Network Security Config 可用于配置明文流量策略和证书信任边界。

## 本地数据保护

敏感数据包括：

- token、refresh token。
- 身份信息。
- 精确定位。
- 私密图片或文件。
- 支付、健康、联系人数据。

实践建议：

- 尽量减少本地保存敏感数据。
- 必须保存时使用 Android Keystore 或加密存储方案。
- 退出登录时清除 token 和用户缓存。
- 备份策略中排除敏感文件。
- 崩溃日志和埋点做脱敏。

## 隐私合规落地清单

- 权限用途与产品功能一致。
- 隐私政策与实际 SDK、数据采集一致。
- 第三方 SDK 数据收集可解释、可关闭或有合规依据。
- 用户能撤回授权、退出登录、删除账号或清除数据。
- 数据安全表单与代码实际行为一致。
- 儿童、健康、金融、定位等敏感场景遵循额外规则。
