![oss](https://img.alicdn.com/imgextra/i4/O1CN01ws7Hju1PU8fFY52Cq_!!6000000001843-0-tps-2608-1000.jpg)
**阿里云静态资源 OSS 组件** ⎯⎯⎯ 通过使用 [Serverless-Devs](https://github.com/Serverless-Devs)，基于云上 Serverless 的对象存储服务，实现“0”配置，便捷开发，极速上传您的静态资源托管到阿里云对象存储 OSS（Object Storage Service）。
静态资源 OSS 组件支持丰富的配置扩展，提供了目前最易用、低成本并且弹性伸缩的静态站点开发和托管能力。
<br/>

# 快速开始

🙋 三步即可上手 对象存储（OSS）组件的使用：  
❶ [安装 Serverless Devs 开发者工具](http://www.serverless-devs.com/serverless-devs/install) ：`npm install -g @serverless-devs/s`；

> 安装完成还需要配置密钥，可以参考[密钥配置文档](http://www.serverless-devs.com/serverless-devs/command/config)

❷ 初始化一个`hexo`静态博客项目：`s init devsapp/website-hexo`；

❸ 初始化完成之后， 只需要输入指令`s deploy`即可完成项目的部署；

# Yaml 规范说明

## 完整配置

```yaml
edition: 1.0.0 #  命令行YAML规范版本，遵循语义化版本（Semantic Versioning）规范
name: website #  项目名称
access: default #  秘钥别名

vars:
  region: cn-hangzhou

services:
  website-start:
    component: oss # (必填) 引用 component 的名称
    props:
      region: ${vars.region}
      bucket: auto # OSS bucket 自动生成
      acl: public-read # 读写权限
      codeUri: ./build # 指定本地要上传目录文件地址
      subDir: subObject # 指定OSS Bucket 文件上传目录
      cors: # OSS 设置跨域资源共享规则
        - allowedOrigin: [https://oss.console.aliyun.com]
          allowedMethod: ['GET', 'PUT', 'DELETE', 'POST', 'HEAD']
        - allowedOrigin: ['https://www.aliyun.com']
          allowedMethod: ['GET']
      referer: # OSS 设置Referer防盗链
        allowEmpty: true
        referers: ['https://edasnext.console.aliyun.com']
      website: # OSS 静态网站配置
        index: index.html # 默认首页
        error: 404.html # 默认 404 页
        subDirType: redirect # 子目录首页 404 规则
      customDomains: # OSS 绑定域名
        - domainName: auto
          protocol: HTTP
```

## 字段解析

| 参数名                              | 必填 | 类型                         | 参数描述   |
| ----------------------------------- | ---- | ---------------------------- | ---------- |
| region                              | True | Enum                         | 地域       |
| [bucket](#bucket字段)             | True | String       | [Struct](#bucket字段)       | OSS Bucket名(全局唯一) |
| codeUri           | True | String      | 指定本地要上传目录文件地址       |
| [acl](#acl字段)           | False | [Enum](#acl字段)      | 函数       |
| subDir           | True | String      | 指定OSS Bucket 文件上传目录       |
| [cors](#cors字段)           | True | [List\<Object\>](#cors字段)      | 跨域资源共享       |
| [referer](#referer字段)           | True | [Object](#referer字段)      | Referer防盗链     |
| [website](#website字段)           | True | [Object](#website字段)      | 静态页面     |
| [customDomains](#customDomains字段)           | True | [Object](#customDomains字段)      | 域名绑定     |

## bucket字段
`bucket`参数的简单配置可以是 `auto`,会自动创建阿里云全局唯一的`bucket`名。
当然也可以指定`bucket`名称，需要注意是的`bucket`名是全局唯一的，注意不要重名

## acl字段
OSS ACL 提供 Bucket 级别的权限访问控制。Bucket目前有三种访问权限：`public-read-write`，`public-read`和`private`，它们的含义如下：
- `public-read-write`: 任何人（包括匿名访问者）都可以对该存储空间内文件进行读写操作
- `public-read`: 只有该存储空间的拥有者可以对该存储空间内的文件进行写操作，任何人（包括匿名访问者）都可以对该存储空间中的文件进行读操作。
- `private`: 只有该存储空间的拥有者可以对该存储空间内的文件进行读写操作，其他人无法访问该存储空间内的文件。

默认配置了[website字段](#website字段)的情况下，`acl`默认属性为`public-read`


## cors字段
[cors](https://help.aliyun.com/document_detail/31870.html)跨域资源设置，解决 JavaScript 的跨域访问问题

| 参数名                | 必填 | 类型                      | 参数描述 |
| --------------------- | ---- | ------------------------- | -------- |
| allowedOrigin                  | True | String                    | 允许来源   |
| allowedMethod                  | True | String                    | 允许 Methods   |

参考案例：
```
cors: # OSS 设置跨域资源共享规则
  - allowedOrigin: [https://oss.console.aliyun.com]
    allowedMethod: ['GET', 'PUT', 'DELETE', 'POST', 'HEAD']
  - allowedOrigin: ['https://www.aliyun.com']
    allowedMethod: ['GET']
```

## referer字段

防盗链功能通过设置[Referer](https://help.aliyun.com/document_detail/31869.html)白名单以及是否允许空Referer，限制仅白名单中的域名可以访问您Bucket内的资源。OSS支持基于HTTP和HTTPS header中表头字段Referer的方法设置防盗链。

是否进行防盗链验证的具体场景如下：

- 仅当通过签名URL或者匿名访问Object时，进行防盗链验证。
- 当请求的Header中包含Authorization字段，不进行防盗链验证


| 参数名                | 必填 | 类型                      | 参数描述 |
| --------------------- | ---- | ------------------------- | -------- |
| allowEmpty                  | False | Boolean                    | 空 Refere   |
| referers                  | True | List<String>                    | referers列表   |

参考案例：
```
referer: # OSS 设置Referer防盗链
  allowEmpty: true
  referers: ['https://edasnext.console.aliyun.com']
```

## website字段
website 静态网站是指所有的网页都由静态内容构成，包括客户端执行的脚本（例如JavaScript）。您可以通过静态网站托管功能将您的静态网站托管到OSS的存储空间（Bucket），并使用Bucket的访问域名访问这个网站。


| 参数名                | 必填 | 类型                      | 参数描述 |
| --------------------- | ---- | ------------------------- | -------- |
| index                  | False | String                    | 默认首页   |
| error                  | True | String                    | 默认 404 页   |
| subDirType                  | False | String                    | 子目录首页   |

## customDomains字段