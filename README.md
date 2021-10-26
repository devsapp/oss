![oss](https://img.alicdn.com/imgextra/i4/O1CN01ws7Hju1PU8fFY52Cq_!!6000000001843-0-tps-2608-1000.jpg)
**阿里云静态资源 OSS 组件** ⎯⎯⎯ 通过使用 [Serverless-Devs](https://github.com/devsapp)，基于云上 Serverless 的对象存储服务，实现“0”配置，便捷开发，极速上传您的静态资源托管到阿里云对象存储OSS（Object Storage Service）。
静态资源OSS组件支持丰富的配置扩展，提供了目前最易用、低成本并且弹性伸缩的静态站点开发和托管能力。
<br/>

特性介绍：

- [x] **按需付费** - 按照请求的使用量进行收费，没有请求时无需付费
- [x] **"0"配置** - 只需要关心项目代码，之后部署即可，Serverless-Devs 会搞定所有配置。
- [x] **极速部署** - 仅需几秒，部署你的静态网站。

<br/>

快速开始：

1. [**安装**](#1-安装)
2. [**创建资源**](#2-创建)
3. [**部署**](#3-部署)
4. [**配置**](#4-配置)
5. [**账号配置**](<#账号配置>)

&nbsp;

### 1. 安装

通过 npm 安装最新版本的 Serverless Devs

```
$ npm install @serverless-devs/s -g
```

### 2. 创建资源
新建文件，如下：
```
├── src
│   ├── index.js
│   └── index.html
└── s.yml

```

在 `src` 目录中既可以托管简单的 html 文件，也可以托管完整的 React/Vue 的应用。

### 3. 部署

在 `s.yml` 文件下的目录中运行如下命令进行部署。部署完毕后，你可以在命令行的输出中查看到你静态资源的 OSS URL 地址，点击地址即可访问网站托管的链接。

```
$ s deploy
```

如果希望查看更多部署过程的信息，可以通过`s deploy --debug` 命令查看部署过程中的实时日志信息

<br/>

### 4. 配置

静态网站组件支持 0 配置部署，也就是可以直接通过配置文件中的默认值进行部署。但你依然可以修改更多可选配置来进一步开发该静态网站项目。

以下是 OSS 组件的 `s.yml`部分配置说明：

```yml
# s.yml
edition: 1.0.0 # 命令行YAML规范版本，遵循语义化版本（Semantic Versioning）规范
name: oss-demo # (必填) 项目名称
access: 'hfs-access'

services:
  oss-demo:
    component: oss # (必填) 引用 component 的名称
    access: default
    props:
      bucket: my-bucket
      src:
        codeUri: './src'
        publishDir: './build'
        index: index.html
        error: index.html
      region: cn-hangzhou
```

当你根据该配置文件更新配置字段后，再次运行 `s deploy`



## 账号配置
通过serverless Devs工具添加密钥信息
```
$ s config add
```
注意：本组件只支持阿里云，需要选择阿里云密钥信息


