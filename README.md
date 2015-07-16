#aproxy

### 安装

npm install -g aproxy

### 使用

````bash
aproxy [-c number] [-p number]
        -p: http 代理端口, 默认80
        -s: https代理端口，默认443
        -c: 配置端口, 默认9999
````

启动后在 http://127.0.0.1:9999 进行配置

如果要用到https代理，请在启动提示中找到证书路径，安装并信任。

### 更新记录
>3.0.0: 同时支持http和https
