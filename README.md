# 前后端分离-项目

## 版本控制
npm：3.10.10

node: 6.10.3 LTS稳定版

## 2017-05-23
增加es6-promise，兼容不支持es6 promise的浏览器（安卓4.3以下）

在axios.min.js源码前加上 `require('es6-promise').polyfill()` 即可

## 2017-05-16
1.	增加HashedChunkIdsPlugin，稳定trunkid;

2.	单独引用manifest不加版本控制