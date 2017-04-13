# 前后端分离-项目编译流程


## 下载项目
github: [https://github.com/guojiangtv/webpack-vue](https://github.com/guojiangtv/webpack-vue)

在本地磁盘（非网络驱动器盘）新建文件夹，down下项目

目录结构为：

  |__ .git
  |__ html
  |__ mock
  |__ nginx-1.8.0
  |__ static_guojiang_tv
  |__ trunk
  |__ webpack-config
    |__ .eslintrc.dev.js
    |__ .eslintrc.js
    |__ compileLogger.js
    |__ handleErrors.js
    |__ postcss.config.js
    |__ resolve.config.js
  |__ .babelrc
  |__ .eslintrc.js
  |__ file.txt
  |__ gulpfile.js
  |__ webpack.config.js
  |__ package.json
  |__ README.md

## 下载svn源码
 
 用svn

 在 html 文件夹内down下：https://10.0.0.15/svn/develop/website/videochat/web/html
 在 static_guojiang_tv 文件夹内down下：https://10.0.0.15/svn/develop/website/static
 在 trunk 文件夹内down下：https://10.0.0.15/svn/develop/website/trunk

### 目录解析

html目录：存放html静态文件，写代码时我们只关心html内的src文件夹，dist目录为访问页面时的目录
静态资源文件：放在 static_guojiang_tv/src/mobile/v2/ 文件夹内， 对应编译后的文件在 static_guojiang_tv/mobile/v2/

## 运行webpack进行编译

开发环境

	cnpm run build

开发环境，开启监听，实时自动刷新浏览器

	cnpm run watch

测试和生产环境

	cnpm run deploy

## 访问页面

直接浏览器访问 html->dist 下的 html 文件
如果需要请求模拟json，到mock文件夹，新建json模拟数据
如果需要服务器支持，比如请求真实服务器接口，还需要以下配置

## 配置host

//前后端分离 本地

	192.168.153.141 m.guojiang.tv
	127.0.0.1 static.guojiang.tv

## 启动nginx

进入nginx-1.8.0目录

启动nginx（切记不要直接双击exe文件）

	start nginx

## 配置服务器允许跨域

在php controller文件最开始添加允许跨域header

	<?php
	header("Access-Control-Allow-Origin: *");
	class MyPropsController extends MyController
	{}

接口内uid改为具体id

如果此接口在loginFilter内，暂时把此接口从loginFilter内删除

另，js接口改写成绝对路径： http://m.guojiang.tv/xxx

## 访问带有请求服务器接口的页面

	http://localhost/xxx.html

本地开发时可以开启cnpm run watch, 此时访问链接

	http://localhost:3000/xxx.html


# 前后端分离-项目发布流程（测试，生产）

1.	cnpm run deploy 编译后，选择html,static_guojiang_tv文件夹提交svn
2.	整理待发布文件保存在发布列表文件（自己在本地建一个文件，专门存放提交svn的待发布文件列表，多次提交即多次保存，最后发布时整理一份完整的发布列表。发布生产后，自己再标记为已发布文件）

发布列表文件示例如下，仅供参考, old代表是已发布的文件列表

	//购买私信卡
	static_guojiang_tv/mobile/v2
	static_guojiang_tv/src/mobile/v2
	videochat/web/html/mobile
	videochat/web/html/pc
	videochat/web/protected/modules/mobile/controllers/MyPropsController.php
	videochat/web/protected/components/CMessageCard.php
	//old
	videochat/web/protected/modules/mobile/views/layouts/common.php
	static_guojiang_tv/mobile/js/recharge/rechargeList.js

## 发布测试环境

到网络映射磁盘更新 videochat, static_guojiang_tv 
接下来发布测试流程和之前一样

*	加入待发布文件列表

		root@debian:/var/www/videochat/tools/send_shell# vi fileList 

*	发布到测试
		
		root@debian:/var/www/videochat/tools/send_shell# ./send2.sh fileList webBetaProxyIpList webBetaIpList 

## 发布生产环境

无需关注 虚拟机那边的文件

*	move待发布文件到trunk
	
	copy待发布文件列表到前后端分离项目下 file.txt 文件

	格式示例：

		static_guojiang_tv/mobile/v2
		static_guojiang_tv/src/mobile/v2
		html/mobile/dist/income.html
		html/mobile/dist/myProps/buy.html
		html/mobile/dist/myProps/history.html
		html/mobile/dist/myProps/index.html


	执行move命令：

	gulp move

*	提交前后端分离项目下 trunk 文件

接下来的操作和以前一样

*	更新到中转机
	到CRT中更新。跟以前一样。
	root@debian:/var/www/videochat/tools/send_shell# ./codeProxyUpdate.sh videochat
	root@debian:/var/www/videochat/tools/send_shell# ./codeProxyUpdate.sh static_guojiang_tv

*	发布
	访问https://admin.guojiang.tv 发布