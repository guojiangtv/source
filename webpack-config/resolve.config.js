var path = require('path')
var baseEntryDir = '../static_guojiang_tv/src/mobile/v2/'

const vue_source = process.env.NODE_ENV === 'production' ? path.resolve(__dirname, baseEntryDir + 'js/lib/vue.min.js') : path.resolve(__dirname, baseEntryDir + 'js/lib/vue.js')

module.exports = {
  // 模块别名的配置，为了使用方便，一般来说所有模块都是要配置一下别名的
	alias: {
		'vue': vue_source,
		'axios': path.resolve(__dirname, baseEntryDir + 'js/lib/axios.min.js'),
		'layer': path.resolve(__dirname, baseEntryDir + 'js/lib/layer.js'),
		'rsa': path.resolve(__dirname, baseEntryDir + 'js/lib/rsa.js'),
		'common': path.resolve(__dirname, baseEntryDir + 'js/common/common.js'),
		'wxShare': path.resolve(__dirname, baseEntryDir + 'js/common/wxShare.js'),
	},

  // 当require的模块找不到时，尝试添加这些后缀后进行寻找
	extensions: ['.js', '.css', '.less', '.vue', '.json'],
}