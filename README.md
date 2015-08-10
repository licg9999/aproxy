#aproxy

## 安装

[sudo] npm install -g aproxy

## 使用

````bash
[sudo] aproxy [-c number] [-s number] [-p number]
        -c: 配置端口, 默认9999
        -p: http 代理端口, 默认80
        -s: https代理端口，默认443
````

启动后在 http://127.0.0.1:9999 进行配置

注意事项：
 1. 启动提示中可以找到安全证书路径
 2. 使用本地反向代理时避免端口冲突

## 更新记录
>3.0.0: 同时支持http和https

>3.1.0: 添加反向代理功能

>3.2.0: 添加chrome插件支持
