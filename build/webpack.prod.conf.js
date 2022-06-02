'use strict'
const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
/** 配置 */
const config = require('../config');
const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: path.posix.join('static', 'js/[name].[contenthash].js'),
    publicPath: config.publicPath
  },
  /** 文件大小限定通知 */
  performance: {
    /** 入口起点的最大体积(单位字节)，这个参数代表入口加载时候最大体积 */
    maxEntrypointSize: 200000,
    /** 此选项根据单个资源体积(单位字节)，控制 webpack 何时生成性能提示，自己将其改成了200kb */
    maxAssetSize: 200000,
    /** 属性允许 webpack 控制用于计算性能提示的文件，通过覆盖原有属性，将其改成只对js|css文件进行性能测试 */
    assetFilter: function (assetFilename) {
      return assetFilename.endsWith('.js') || assetFilename.endsWith('.css');
    }
  },
  optimization: {
    minimizer: [
      new TerserPlugin(),
      new CssMinimizerPlugin({
        test: /\.css$/g,
        include: /\.css$/g,
        parallel: true,
        minimizerOptions: {
          preset: [
            "default",
            {
              discardComments: { removeAll: true },
            },
          ]
        }
      })
    ],
    splitChunks: {
      /** 这表示将选择哪些块进行优化。当提供一个字符串，
       * 有效值为all，async和initial。提供all可以特别强大，
       * 因为这意味着即使在异步和非异步块之间也可以共享块 */
      chunks: "all",
      /** 规定被提取的模块在压缩前的大小最小值，单位为字节，默认为30000，只有超过了30000字节才会被提取 */
      minSize: 20000,
      /** 把提取出来的模块打包生成的文件大小不能超过maxSize值，如果超过了，
       * 要对其进行分割并打包生成新的文件。单位为字节，默认为0，表示不限制大小 */
      maxSize: 200000,
      /** 表示要被提取的模块最小被引用次数，引用次数超过或等于minChunks值，才能被提取 */
      minChunks: 2,
      /** 最大的按需(异步)加载次数，默认为 6,
       * 可以理解为：当整个项目打包完之后，一个按需加载的包最终被拆分成 n 个包，maxAsyncRequests 就是用来限制 n 的最大值 */
      maxAsyncRequests: 100,
      /** 打包后的入口文件加载时，还能同时加载js文件的数量（包括入口文件），默认为4。）,
       * 可以理解为：同 maxAsyncRequests 配置类似，该配置表示入口点能被拆分的最大数量
       */
      maxInitialRequests: 2,
      /** 打包生成的js文件名的分割符，默认为~ */
      automaticNameDelimiter: '~',
      /** 拆分块的名称。提供false将保持块的相同名称，因此它不会不必要地更改名称。这是生产版本的推荐值。 */
      name: false,
      cacheGroups: {
        default: false,
        vendors: {
          chunks: "all",
          test: /[\\/]node_modules[\\/]/,
          minSize: 400000,
          maxSize: 400000,
          minChunks: 1,
          maxAsyncRequests: 100,
          maxInitialRequests: 2,
          priority: 1,
          name: 'vendors'
        },
        index: {
          chunks: "all",
          test: /[\\/]src[\\/]js[\\/]/,
          minChunks: 1,
          maxAsyncRequests: 2,
          maxInitialRequests: 30,
          minSize: 0,
          priority: 1,
          name: 'index'
        },
        styles: {
          chunks: 'all',
          test: /\.css$/,
          minChunks: 1,
          name: 'styles'
        }
      }
    }
  },
  plugins: [
    // http://vuejs.github.io/vue-loader/en/workflow/production.html
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"',
        APP_ENV: JSON.stringify(process.env.APP_ENV)
      }
    }),
    new MiniCssExtractPlugin({
      ignoreOrder: true,
      filename: path.posix.join('static', 'css/[name].[contenthash].css'),
      chunkFilename: path.posix.join('static', 'css/[id].[contenthash].css')
    }),
    // generate dist index.html with correct asset hash for caching.
    // you can customize output by editing /index.html
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      //publicPath如果不配置则使用webpackConfig.output.publicPath
      //publicPath: config.publicPath,
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: 'index.html',
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true
        // more options:
        // https://github.com/kangax/html-minifier#options-quick-reference
      },
      // necessary to consistently work with multiple chunks via CommonsChunkPlugin
      chunksSortMode: 'auto',
      favicon: 'static/favicon.ico'
    }),
    // keep module.id stable when vendor modules does not change
    new webpack.ids.HashedModuleIdsPlugin(),
    /** gz压缩插件 */
    new CompressionWebpackPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: new RegExp(
        '\\.(js|css)$'
      ),
      /** 大于该配置的文件被压缩,单位字节 */
      threshold: 128,
      /** 压缩率 */
      minRatio: 0.8,
      /** 压缩后删除原文件 */
      deleteOriginalAssets: false
    })
  ]
})

if (process.env.npm_config_report) {
  const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
  webpackConfig.plugins.push(new BundleAnalyzerPlugin({
    analyzerPort: 'auto'
  }))
}

module.exports = webpackConfig
