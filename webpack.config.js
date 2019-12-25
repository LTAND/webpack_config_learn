const path = require('path');   // 引入我们的node模块里的path
// console.log(path.resolve(__dirname,'dist')); // 物理地址拼接
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const pages = [
  {                             // 将模板的头部和尾部添加css和js模板,dist 目录发布到服务器上，项目包。可以直接上线
    file: 'home.html',         // 打造单页面运用 最后运行的不是这个
    template: './src/pages/Home/home.html'  // vue-cli放在跟目录下
  },
  {
    filename: "test.html",
    template: "./src/pages/Test/test.html"
  }
]
module.exports = {
  entry: {
    test: './src/pages/Test/test.js'
  }, 
  output: {                                  // 向外输出
    path: path.resolve(__dirname, 'dist'),   // 输出文件的目标路径
    filename: '[name].js',
    chunkFilename: '[name].chunk.[hash:8].js' 
  },
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
        test: /\.less$/,        // 正则匹配以.less结尾的文件
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },
    ]
  },
  devServer: {
    contentBase: path.join(__dirname, "dist"), // 服务器资源的根目录, 默认是当前执行的目录,一般是项目的根目录
    hot: true,
    host: '0.0.0.0',
    port: '8080',
    inline: true,    // 当源文件改变时会自动刷新页面
    open: true,      //  DevServer启动且第一次构建完成时，自动使用我们的系统默认浏览器去打开网页
    overlay: true,   // 编译出错的时候，在浏览器页面上显示错误。该属性值默认为false
    compress: false, // 配置是否启用 gzip 压缩, 默认false 
    // proxy: {
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
  devtool: 'source-map', // 生成对于打包后调试的完整的.map文件，但同时也会减慢打包速度
  plugins: [                      // 插件对打包过程的影响，引用, 压缩，分离美化
    new HtmlWebpackPlugin(pages[1]),
    new ExtractTextPlugin('[name].css'),
  ]
}