var autoprefixer = require('autoprefixer')
module.exports = {
	plugins: [
	  	autoprefixer({
	  		browsers: ['> 1%', 'iOS >= 7',"ie >= 7", 'Android >= 2.4']
	  	})
	]
}