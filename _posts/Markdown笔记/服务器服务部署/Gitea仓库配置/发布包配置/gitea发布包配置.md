# 1. gitea 服务器端配置

gitea 仓库本身支持软件包/云仓库的发布。只需在配置文件中开启相关功能即可
https://docs.gitea.com/zh-cn/administration/config-cheat-sheet#%E5%8C%85packages
1.在服务器上找到部署的 Gitea仓库的 配置文件 `custom/conf/app.ini`
2.开启配置文件里的包注册功能(其他配置根据需要选择性配置)

`ENABLED：true: 启用/禁用包注册表功能。`

3. 服务器端配置完成。

![](./imgs/包配置.png)

# 2. 软件包注册发布

https://docs.gitea.com/zh-cn/usage/packages/maven

前提：在gitea上注册账户，并生成专属令牌，并给令牌授予包的读写权限

![](./imgs/令牌配置.png)

1. 编写代码完成
2. 编译生成jar文件
3. 配置 build.gradle.kts 文件，如下

```kotlin

plugins {
    `maven-publish` #Maven 包发布插件
}

publishing {
    publications {
        create<MavenPublication>("mavenJava") {   
            from(components["java"])  # 发布的包类型
        }
    }
    repositories {
        maven {
            name = "Gitea"   
		# Gitea地址 
            url = uri("http://192.168.1.203:3000/api/packages/NiuShaoXiong/maven")  
         # Gradle 默认 HTTPS 协议，但服务器的 Gitea 部署为 http 明文传输，需要显示配置允许使用 HTTP 传输
            isAllowInsecureProtocol = true   
			# 权限验证
            credentials {
                username = "token"      #固定位 Token 字段
                password = "{你的token}" # 生成的专属Token
            }
        }
    }
}

```



4、配置完成后使用 gradle 指令进行发布

` ./gradlew publishAllPublicationsToGiteaRepository`

或直接在 IDE 中进行可视化发布：

![](./imgs/IDE_Gradle发布.png)

5. 发布成功后可在浏览器 gitea 的账户下看到发布的软件包

# 3. 仓库使用
团队其他人引入或使用发布的仓库时：

```kotlin
repositories {
       // other repositories
       maven { url=uri("http://192.168.1.203:3000/api/packages/NiuShaoXiong/maven") 
       isAllowInsecureProtocol = true    # 同样需要指定运行明文传输
       }
}```


```