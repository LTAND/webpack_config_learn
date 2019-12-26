module.exports = {
  plugins: {
    autoprefixer: {
      overrideBrowserslist: ['Android >= 4.0', 'iOS >= 7']
    },
    'postcss-pxtorem': {
      rootValue: 100,             // 设计稿 640，750，1125 分成100份 1a = 7.5px，1rem = 75px
      propList: ['*'],            // !不匹配属性（这里是字体相关属性不转换）['*', '!font*']
      unitPrecision: 3,           // 最小精度，小数点位数
      minPixelValue: 2,           // 替换的最小像素值
      selectorBlackList: ['van']  // 过滤掉以van开头的样式
    }
  }
}