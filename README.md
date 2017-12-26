# 前后端分离-项目

## 版本控制
yarn：0.24.6

npm：3.10.10

node: 6.10.3 LTS稳定版

## 2017-12-26
为了加快编译速度，增加 编译时忽略旧文件的功能

## 2017-12-18
增加 pc前后端分离编译环境

## 2017-10-30
更新统一仓库名字为source
 

我们 的模块ID会根据文件路径来计算，github更新后默认项目文件夹名字为source，如果有不同，会导致编译后部分文件的模块ID有改动
 
## 2017-06-03
更换包管理工具npm为yarn

主要考虑：

1.	npm管理安装模块依赖的版本不太方便，容易在删除node_modules重新install或在其他机器上新安装时，安装模块的依赖的版本不一致，导致编译后的模块ID或trunkID不一致。yarn可以方便的自动生成并更新yarn.lock文件锁定依赖模块的版本。

2.	yarn可以从缓存中安装包，速度会有所提升

## 2017-05-23
增加es6-promise，兼容不支持es6 promise的浏览器（安卓4.3以下）

在axios.min.js源码前加上 `require('es6-promise').polyfill()` 即可

## 2017-05-16
1.	增加HashedChunkIdsPlugin，稳定trunkid;

2.	单独引用manifest不加版本控制
