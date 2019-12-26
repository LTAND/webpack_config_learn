#### 安装webpack
```
// install    可简写为i,
// --global   可简写为-g
// --save     可简写为-S
// --save-dev 可简写为-D
```

```javascript
cnpm install webpack webpack-cli -D
npm init -y  //-y 默认所有的配置
```

## 五、构建本地服务
### [5.1] webpack-dev-server配置本地服务器
```
npm install webpack-dev-server -D
devServer: {
    contentBase: path.join(__dirname, "dist"), // 服务器资源的根目录, 默认是当前执行的目录,一般是项目的根目录
    hot: true,
    host: '0.0.0.0'，
    port: '8080',
    inline: true,    // 当源文件改变时会自动刷新页面
    open: true,     //  DevServer启动且第一次构建完成时，自动使用我们的系统默认浏览器去打开网页
    overlay: true,   // 编译出错的时候，在浏览器页面上显示错误。该属性值默认为false
    compress: false,  // 配置是否启用 gzip 压缩, 默认false 
    proxy: {
      '/api': {
        target: 'http://news.baidu.com', // 服务端接口的域名
        // secure: true,     // https 的时候 使用该参数
        changeOrigin: true,  // 是否跨域
        pathRewrite: {
          '^/api' : ''      // 重写路径
        }
      }
    },
},
devtool: 'source-map' // 生成对于打包后调试的完整的.map文件，但同时也会减慢打包速度

// package.json
"scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server --open"
} 
```
## 六、Loaders
- test：一个用以匹配loaders所处理文件的拓展名的正则表达式（必须）
- loader：loader的名称（必须）
- include/exclude： 手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）options： 为loaders提供额外的设置选项（可选）

```
npm install babel-loader @babel/core @babel/preset-env -D
npm install babel-loader babel-core babel-preset-env -D
// 使用install babel是会出现版本问题, 两种办法
// 1. webpack 4.x | babel-loader 7.x | babel 6.x 回退低版本
npm install -D babel-loader@7 babel-core babel-preset-env
// 2. webpack 4.x | babel-loader 8.x | babel7.x 更新到最高版本
npm install -D babel-loader @babel/core @babel/preset-env webpack  

npm install vue vue-loader vue-template-compiler vue-style-loader --save-dev
const VueLoaderPlugin = require('vue-loader/lib/plugin');
{
    test: /\.vue$/,
    use: ['vue-loader']
},
new VueLoaderPlugin()

npm install style-loader css-loader less less-loader -D
npm install sass-loader node-sass style-loader -D // 因为sass-loader依赖于node-sass，所以还要安装node-sass
module: {
  rules: [
    {
      test: /\.js$/,                         // es6 => es5 
      include: [path.resolve(__dirname, 'src')],
        // exclude:[], 不匹配选项（优先级高于test和include）
      use: 'babel-loader'
    },
    {
      test: /\.css$/,                      // 正则匹配以.css结尾的文件
      use: ['style-loader', 'css-loader']  // 因为调用loader是从右往左编译的
    },
    {
      test: /\.(scss|sass)$/,              // 正则匹配以.scss和.sass结尾的文件
      use: ['style-loader', 'css-loader', 'sass-loader']  
    },
    {
      test: /\.less$/,                     // 正则匹配以.less结尾的文件
      use: ['style-loader', 'css-loader', 'less-loader'] 
    },
  ]  
}

npm install postcss-loader autoprefixer postcss-pxtorem -D

loader:"postcss-loader"
// postcss.config.js
module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*']
    }
  }
}

npm install --save-dev mini-css-extract-plugin optimize-css-assets-webpack-plugin 
optimization:{                          // 优化项
  minimizer:[
    new OptimizeCss()                   // 压缩css插件
  ]
},
替代style-loader
MiniCssExtractPiugin.loader


cnpm install file-loader url-loader html-withimg-loader -D
    {
      // 打包html模板文件中img标签的图片
      test: /\.html$/,
      loader: "html-withimg-loader"
    },
		{
			test: /\.(gif|jpe?g|png|bmp|webp|svg)(\?.*)?$/,
			use: [{
				loader: 'url-loader',
				options: {
					limit: 4 * 1024, 
					name: 'img/[name].[hash:8].[ext]',
					// publicPath: 'img/',//将css中引用的背景图片打包到output.path + publicPath + name
					// outputPath: ''

					// fallback: { //此处无需配置file-loader的回调也可正常构建，url-loader会自动调用，并共享name等配置项目
					// 	loader: 'file-loader',
					// 	options: {
					// 		name: 'img/[name].[hash:8].[ext]',
					// 		// publicPath: 'img/',//将css中引用的背景图片打包到output.path + publicPath + name
					// 		// outputPath: ''
					// 	}
					// }
				}
			}]
		},
```

## 七、Plugins（插件）

## 自动生成html文件插件
```
cnpm install html-webpack-plugin -D 
new HtmlWebpackPlugin({
  template: path.join(__dirname, "/src/index.html")
})
```

##  热更新（HotModuleReplacementPlugin）
```
# 修改代码后自动刷新预览效果。
devServer{
    hot: true
},
plugins:[
    new webpack.HotModuleReplacementPlugin()  // webpack自带的插件
]
```

## 清理打包后文件夹(clean-webpack-plugin)
```
cnpm install clean-webpack-plugin -D 
plugins:[
    new CleanWebpackPlugin(['dist']),  // 所要清理的文件夹名称
]

```

## 隔离css和html插件(extract-text-webpack-plugin)
```
// 隔离css和html
cnpm install extract-text-webpack-plugin@next -D 

// webpack.config.js
const ExtractTextPlugin = require('extract-text-webpack-plugin')     //打包的css拆分,将一部分抽离出来  
module: {
  rules: [
    {
      test: /\.less$/, //正则匹配我们以.less结尾的文件
      use: ExtractTextPlugin.extract({
        // use: 指需要什么样的loader去编译文件, 这里由于源文件是.css所以选择css - loader
        // fallback: 编译后用什么loader来提取css文件
        // publicfile: 用来覆盖项目路径, 生成该css文件的文件路径
        fallback: 'style-loader',
        use: [
          'css-loader',
          'less-loader'
        ]
      })
    },
  ]
},
plugins：[
  new ExtractTextPlugin('[name].css'),  //[name] 默认  也可以自定义name  声明使用
]
```
## 项目优化
## 消除冗余的css
```
npm install purifycss-webpack purify-css glob -D

// webpack.prod.js
const path = require('path');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // 引入CleanWebpackPlugin插件
const PurifyCssWebpack = require('purifycss-webpack'); // 引入PurifyCssWebpack插件
const glob = require('glob');  // 引入glob模块,用于扫描全部html文件中所引用的css

module.exports = merge(common, { // 将webpack.common.js合并到当前文件
    devtool: 'source-map',  // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
    plugins: [
        new CleanWebpackPlugin(),
        new PurifyCssWebpack({
            paths: glob.sync(path.join(__dirname, 'src/*.html')) // 同步扫描所有html文件中所引用的css
        })
    ]
})
```
## 处理图片 base64 或 路径形式
```
// 虽然我们只需使用url-loader，但url-loader是依赖于file-loader的，所以也要安装
npm install url-loader file-loader -D 

// 路径形式
// webpack.common.js
const path = require('path');
const webpack = require('webpack');  // 这个插件不需要安装，是基于webpack的，需要引入webpack模块
const HtmlWebpackPlugin = require('html-webpack-plugin'); // 引入HtmlWebpackPlugin插件
const ExtractTextPlugin = require('extract-text-webpack-plugin') //引入分离插件
module.exports = {
    entry: {
        index: path.join(__dirname, "/src/index.js"),
        index2: path.join(__dirname, "/src/index2.js")
    },
    output: {
        path: path.join(__dirname, "/dist"), // 打包后的文件存放的地方 
        filename: "[name].js" // 打包后输出文件的文件名
    },
    module: {
        rules: [
            {
                test: /\.css$/,   // 正则匹配以.css结尾的文件
                use: ExtractTextPlugin.extract({  // 这里我们需要调用分离插件内的extract方法
                    fallback: 'style-loader',  // 相当于回滚，经postcss-loader和css-loader处理过的css最终再经过style-loader处理
                    use: ['css-loader']
                })
            },
            {
                test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
                use: ['style-loader', 'css-loader', 'sass-loader']  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
            },
            {
                test: /\.(png|jpg|svg|gif)$/,  // 正则匹配图片格式名
                use: [
                    { loader: 'url-loader'  // 使用url-loader }
                ]
            },
        ]
    },
    plugins: [
        new webpack.BannerPlugin('版权所有，翻版必究'),  // new一个插件的实例 
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "/src/index.html")// new一个这个插件的实例，并传入相关的参数
        }),
        new webpack.HotModuleReplacementPlugin(), // 热更新插件
        new ExtractTextPlugin('css/index.css') // 将css分离到/dist文件夹下的css文件夹中的index.css 
    ]
}
module: {
    rules: [
      {
        test: /\.css$/,   // 正则匹配以.css结尾的文件
        use: ExtractTextPlugin.extract({  // 这里我们需要调用分离插件内的extract方法
          fallback: 'style-loader',  // 相当于回滚，经postcss-loader和css-loader处理过的css最终再经过style-loader处理
          use: ['css-loader'],
          publicPath: '../'  // 给背景图片设置一个公共路径
        })
      },
      {
        test: /\.(scss|sass)$/,   // 正则匹配以.scss和.sass结尾的文件
        use: ['style-loader', 'css-loader', 'sass-loader'],  // 需要用的loader，一定是这个顺序，因为调用loader是从右往左编译的
      },
      {
        test: /\.(png|jpg|svg|gif)$/,  // 正则匹配图片格式名
        use: [
          {
            loader: 'url-loader',  // 使用url-loader
            options: {
              limit: 1000,  // 限制只有小于1kb的图片才转为base64，例子图片为1.47kb,所以不会被转化
              outputPath: 'images',  // 设置打包后图片存放的文件夹名称
            },
          }
        ]
      },
    ]
  },

```


```
npm init -y

 "scripts": {
    "build": "webpack",
    "dev": "webpack-dev-server --open"
  },
  
// webpack.config.js
const path = require('path');
module.exports = {
  entry: path.join(__dirname, "/src/index.js"), // 入口文件
  output: {
    path: path.join(__dirname, "/dist"), // 打包后的文件存放的地方 
    filename: "bundle.js" // 打包后输出文件的文件名
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    hot: true,     // 热替换功能
    port: '8080',
    inline: true,  // 当源文件改变时会自动刷新页面
    open: true,
    overlay: true,  // 该属性是用来在编译出错的时候，在浏览器页面上显示错误。
  },
  devtool: 'source-map' // 会生成对于调试的完整的.map文件，但同时也会减慢打包速度
}

```


