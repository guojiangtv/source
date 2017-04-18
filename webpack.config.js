// 引入操作路径模块和webpack 
var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin') //抽离css
var htmlWebpackPlugin = require('html-webpack-plugin')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

//生产与开发环境配置
var glob = require('glob')
var prod = process.env.NODE_ENV === 'production' ? true : false //是否是生产环境

//webpack配置
var eslintConfigDir = prod ? './webpack-config/.eslintrc.js' : './webpack-config/.eslintrc.dev.js'
var postcssConfigDir = './webpack-config/postcss.config.js'
var resolveConfigDir = './webpack-config/resolve.config.js'

//目录配置
var baseEntryDir = './static_guojiang_tv/src/mobile/v2/'
var entryDir = baseEntryDir + '**/*.js'
var outDir = path.resolve(__dirname, './static_guojiang_tv/mobile/v2')
var outPublicDir = 'http://static.guojiang.tv/mobile/v2/'
var basePageEntry = './html/mobile/'
var browserSyncBaseDir = './html/mobile/dist'

//入口js文件配置以及公共模块配置
var entries = getEntry(entryDir) 
entries.vendors = ['vue','axios','common']

console.log(entries)

module.exports = {
    /* 输入文件 */
	resolve: require( resolveConfigDir ),
	entry: entries,
	output: {
		path: outDir,
		publicPath: outPublicDir,
		filename: 'js/[name].js?v=[chunkhash:8]'
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.ejs$/,
				loader: 'ejs-loader'
			},
			{
				test: /\.js$/,
				enforce: 'pre',
				loader: 'eslint-loader',
				include: path.resolve(__dirname, entryDir),
				exclude: [baseEntryDir + 'js/lib', baseEntryDir + 'js/component'],
				options: {
					fix: true
				}
			},
			{
				test: /\.js$/,
				loader: 'babel-loader',
        		exclude: ['node_modules', baseEntryDir + 'js/lib', baseEntryDir + 'js/component']
			},
			{   
        		test: /\.css$/, 
				use: ['style-loader', 'css-loader', 'postcss-loader'],
				exclude: [baseEntryDir + 'css/lib']
			},
			{
				test: /\.less$/,
				use: ExtractTextPlugin.extract(['css-loader','postcss-loader','less-loader']),
			},
			{
				test: /\.(png|jpg|gif)$/,
				loader: 'url-loader',
				options: {
					limit: 512,
					name: function(p){
						let tem_path = p.split(/\\img\\/)[1]
						tem_path = tem_path.replace(/\\/g,'/')

						return 'img/'+tem_path + '?v=[hash:8]'
					}
				}
			},
			{
				test: /\.html$/,
				use: [ {
					loader: 'html-loader',
					options: {
						minimize: true
					}
				}],
			}
		]
	},
	plugins: [
		new BrowserSyncPlugin({
			host: ['m.guojiang.tv','m.tuho.tv'],
			port: 3000,
			server: { baseDir: [browserSyncBaseDir] }
		}),

		new ExtractTextPlugin('css/[name].css?v=[contenthash:8]'),
    
		new webpack.LoaderOptionsPlugin({
			options: {
				eslint: require( eslintConfigDir ),
				postcss: require( postcssConfigDir )
			},
		}),

    	// 提取公共模块
		new webpack.optimize.CommonsChunkPlugin({
			names:  ['vendors', 'manifest'], // 公共模块的名称
      		//filename: 'js/vendors-[hash:6].js', // 公共模块的名称
			chunks: 'vendors',  // chunks是需要提取的模块
			minChunks: Infinity  //公共模块最小被引用的次数
		})
	]
}




/***** 生成组合后的html *****/

var pages = getEntry(basePageEntry + 'src/**/*.ejs')
for (var pathname in pages) {
	var pathArr = pathname.split('-')

	var new_dir = ''
	pathArr.forEach(function(val){
		new_dir += '/' + val
	})

	var conf = {
		filename: path.resolve(__dirname, basePageEntry + 'dist' + new_dir + '.html'), // html文件输出路径
		template: path.resolve(__dirname, basePageEntry + 'src'+ new_dir + '.js'),
		inject: true, 
		cache: true, //只改动变动的文件
		minify: {
			removeComments: true,
			collapseWhitespace: false
		}
	}
	if (pathname in module.exports.entry) {
		conf.chunks = [pathname, 'vendors', 'manifest']
	}else{
		conf.chunks = []
	}	

	module.exports.plugins.push(new htmlWebpackPlugin(conf))
}




/***** 获取文件列表(仅支持js和ejs文件)：输出正确的js和html路径 *****/

function getEntry(globPath) {
	var entries = {}, basename

	glob.sync(globPath).forEach(function (entry) {

    	//排出layouts内的公共文件
		if(entry.indexOf('layouts') == -1 && entry.indexOf('lib') == -1 && entry.indexOf('component') == -1){

			//判断是js文件还是ejs模板文件
			let isJsFile = entry.indexOf('.js') !== -1
			let dirArr = isJsFile ? 
						entry.split('/js/')[1].split('.js')[0].split('/') :
						entry.split('html/mobile/src/')[1].split('.ejs')[0].split('/')
			
			basename = dirArr.join('-')
			entries[basename] = entry
		}
	})
	return entries
}




/***** 区分开发环境和生产环境 *****/

if (prod) {
	console.log('当前编译环境：production')

	//module.exports.devtool = 'source-map'
	module.exports.plugins = module.exports.plugins.concat([
		//new CleanWebpackPlugin(['dist']),
    	//压缩css代码
		new OptimizeCssAssetsPlugin({
			assetNameRegExp: /\.css/g,  //注意不要写成 /\.css$/g
			cssProcessor: require('cssnano'),
			cssProcessorOptions: { discardComments: {removeAll: true } },
			canPrint: true
		}),
 		//压缩JS代码
		new webpack.optimize.UglifyJsPlugin({
			output: {
				comments: false, // 去掉注释内容
			}
		})
	])
} else {  
	console.log('当前编译环境：dev')

	module.exports.devtool = 'cheap-module-source-map'
}