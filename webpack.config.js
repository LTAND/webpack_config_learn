const path = require('path');   // 引入我们的node模块里的path
// console.log(path.resolve(__dirname,'dist')); // 物理地址拼接
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCss = require("optimize-css-assets-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const webpack = require("webpack")

const pages = [
  {
    template: './src/pages/Home/home.html',
    filename: 'home.html'
  },
  {
    template: "./src/pages/Test/test.html",
    filename: "test.html",
    inject: 'body',                       // 指定生成的js文件是在head里还是在body里面,不写默认在body里面
    chunks: ["test"],                       // 引入入口的的test js文件
    minify: {
      removeComments: true,               // 删除注释
      collapseInlineTagWhitespace: true,  // 去除换行符
      collapseWhitespace: true,           // 压缩代码
      removeAttributeQuotes: true,          // 删除引号
    },
    hash: true                              // 引入加入?41f1591fbdcae2c85e5a
  }
]

module.exports = {
  optimization: {                          // 优化项
    minimizer: [
      new OptimizeCss()                   // 压缩css插件
    ]
  },

  mode: 'development',                      // development | production
  entry: {
    test: './src/pages/Test/test.js'
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[hash:8].js',        // 哈希值8位
    // publicPath : 'http://kuma.com/',    // 给所有输出文件加上公共的地址头，满足上线要求。
    chunkFilename: '[name].chunk.[hash:8].js'
  },

  module: {
    rules: [
      // 调用loader是从右往左编译的，从下到上
      {
        test: /\.js$/,                         // es6 => es5 
        include: [path.resolve(__dirname, 'src')],
        loader: "babel-loader",
        // exclude: path.resolve(__dirname, 'node_modules'),  //不匹配选项（优先级高于test和include）
        // options: {            // loader的可选项
        //   presets: ["es2015"]
        // },
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      },
      {
        // 打包html模板文件中img标签的图片
        test: /\.html$/,
        loader: "html-withimg-loader"
      },
      {
        test: /\.css$/,                      // 正则匹配以.css结尾的文件
        use: [{ loader: 'style-loader', options: { insertAt: 'top' } }, 'css-loader', 'postcss-loader']  // style-loader将css插入head的style标签中
      },
      {
        test: /\.(scss|sass)$/,              // 正则匹配以.scss和.sass结尾的文件
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'sass-loader']
        })
      },
      {
        test: /\.less$/,                     // 正则匹配以.less结尾的文件
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'postcss-loader', 'less-loader']
        })
      },
      {
        test: /\.(gif|jpe?g|png|bmp|webp|svg)(\?.*)?$/,
        use: [{
          loader: 'url-loader',
          options: {
            limit: 5 * 1024, // 小于4k 用base4
            name: 'img/[name].[hash:8].[ext]',
            // publicPath: 'img/',          // 将css中引用的背景图片打包到output.path + publicPath + name
            // outputPath: 'http:new.baidu.com/'     // 输出路径 http:new.baidu.com/

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
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'fonts/[name].[hash:7].[ext]'
        }
      }
    ]
  },
  plugins: [                      // 插件对打包过程的影响，引用, 压缩，分离美化
    new CleanWebpackPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin(pages[1]),
    new ExtractTextPlugin('[name].css'),
    new VueLoaderPlugin(),
    // new webpack.ProvidePlugin:{  // 每个模块注入$
    // main.js import "$" from "jquery"
    //   $:"jquery"  
    // }

    // externals:{
    //   // 使用cdn加载时可以取消对jquery打包
    //   jquery:"$"
    // }

    // 压缩输出的 JS 代码
    new UglifyJsPlugin({
      uglifyOptions: {
        parallel: true,      // 多进程并行运行,默认4
        output: {            // 最紧凑的输出
          beautify: false,   // 删除所有的注释
          comments: false,   // 忽略无关紧要的...
        }
      }
    }),
  ],
  devServer: {
    contentBase: path.join(__dirname, "dist"), // 服务器资源的根目录, 默认是当前执行的目录,一般是项目的根目录
    hot: true,
    host: '127.0.0.1',
    port: '8080',
    inline: true,    // 当源文件改变时会自动刷新页面
    open: true,      //  DevServer启动且第一次构建完成时，自动使用我们的系统默认浏览器去打开网页
    overlay: true,   // 编译出错的时候，在浏览器页面上显示错误。该属性值默认为false
    compress: false, // 配置是否启用 gzip 压缩, 默认false 
    // proxy: {  // 代理
    //   '/api': {
    //     target: 'http://news.baidu.com', // 服务端接口的域名
    //     // secure: true,     // https 的时候 使用该参数
    //     changeOrigin: true,  // 是否跨域
    //     pathRewrite: {
    //       '^/api': ''      // 重写路径
    //     }
    //   }
    // },
  },
  // resolve: {
  //   extensions: ['.js', '.json', '.vue'],
  //   alias: {
  //     '@': path.join(__dirname, 'src')
  //     // 'vue$': 'vue/dist/vue.esm.js'
  //   }
  // },
  /**
   * 
   * 
   * 
   *  */
  devtool: 'source-map', // 生成对于打包后调试的完整的.map文件，但同时也会减慢打包速度
}