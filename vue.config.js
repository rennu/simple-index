const HtmlWebpackPlugin = require('html-webpack-plugin')
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
module.exports = {
  configureWebpack: {
    plugins: [
      new HtmlWebpackPlugin({
        template: 'public/index.html', // template file to embed the source
        inlineSource: '.(js|css)$', // embed all javascript and css inline
        title: 'Index of...'
      }),
      new HtmlWebpackInlineSourcePlugin(HtmlWebpackPlugin)
    ]
  }
}
