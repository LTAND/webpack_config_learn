const autoprefixer = require('autoprefixer');
const pxtorem = require('postcss-pxtorem');

module.exports = {
  outputDir: 'dist',   //build输出目录
  assetsDir: 'assets', //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  css: {  
    // 是否使用css分离插件 ExtractTextPlugin
    extract: true,
    // 开启 CSS source maps?
    sourceMap: false,
    // css预设器配置项
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer({
            overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
          }),
          pxtorem({
            rootValue: 75,              // 设计稿 640，750，1125 分成100份 1a = 7.5px，1rem = 75px
            propList: ['*'],  // !不匹配属性（这里是字体相关属性不转换）['*', '!font*']
            unitPrecision: 3,           // 最小精度，小数点位数
            minPixelValue: 2,           // 替换的最小像素值
            selectorBlackList: ['van']  // 过滤掉以van开头的样式
          })
        ]
      }
    }
  },
  devServer: {
    open: true, //是否自动弹出浏览器页面
    host: "0.0.0.0",
    port: '8081',
    https: false,   //是否使用https协议
    hotOnly: true, //是否开启热更新
    proxy: {
      '/v1': {
        target: 'http://localhost:3000', //API服务器的地址
        ws: true,  //代理websockets
        changeOrigin: true, // 虚拟的站点需要更管origin
        // pathRewrite: {   //重写路径 比如'/api/aaa/ccc'重写为'/aaa/ccc'
        //   '^/api': ''
        // }
      }
    },
    before: app => { }
  },
  // 第三方插件配置
  pluginOptions: {
    // ...
  }
}