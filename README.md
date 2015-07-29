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

*用到https代理时，请在启动提示中找到证书路径安装并信任。*

## 更新记录
>3.0.0: 同时支持http和https
 3.1.0: 添加反向代理功能
