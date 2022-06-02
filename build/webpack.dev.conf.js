'use strict'

const webpack = require('webpack');
const { merge } = require('webpack-merge');
const path = require('path');
const baseWebpackConfig = require('./webpack.base.conf');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/** 配置 */
const config = require('../config');

const devWebpackConfig = merge(baseWebpackConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    /** 是否启用 webpack 的模块热替换特性 */
    hot: true,
    devMiddleware: {
      index: true,
      mimeTypes: { "text/html": ["phtml"] },
      /** 此路径下的打包文件可在浏览器中访问 */
      publicPath: "/",
      serverSideRender: true,
      writeToDisk: true,
    },
    /** 告诉服务器从哪里提供内容。只有在你想要提供静态文件时才需要 */
    /** 使用CopyWebpackPlugin插件，我们把它配置为false */
    static: false,
    client: {
      /** 终端日志级别, "none" | "error" | "warn" | "info" | "log" | "verbose"` */
      logging: "warn",
      /** 在浏览器界面展示编译错误或警告，对象或者直接false */
      overlay: {
        warnings: false,
        errors: true
      },
      /** 是否将运行进度输出到控制台 */
      progress: true,
    },
    /** 运行ip, 可以指定"local-ip"使用localhost */
    host: 'localhost',
    /** 运行端口, 可以指定'auto'自动选择 */
    port: 'auto',
    /** 运行所有host访问 */
    allowedHosts: "all",
    ////////////////////////////////////////////////////
    /** 404跳转配置 */
    historyApiFallback: {
      rewrites: [{
        from: /./,
        to: '/index.html'
      }],
      disableDotRule: true
    },
    /** 一切服务都启用gzip 压缩 */
    compress: true,

    /** 代理 */
    proxy: {
      /** 后端代理 */
      "/serverProxy": {
        /** 真实地址 */
        target: config.serverPath,
        /** 是否跨域 */
        changeOrigin: true,
        /** 路径重写 */
        pathRewrite: {
          "^/serverProxy": ""
        }
      }
    },
    /** 启动成功后是否自动打开浏览器 */
    open: false
  },
  optimization: {
    emitOnErrors: true
  },
  plugins: [
    /** 允许创建一个在编译时可以配置的全局常量。这可能会对开发模式和发布模式的构建允许不同的行为非常有用。
     * 如果在开发构建中，而不在发布构建中执行日志记录，则可以使用全局常量来决定是否记录日志。
     * 这就是 DefinePlugin 的用处，设置它，就可以忘记开发和发布构建的规则。 */
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"development"',
        APP_ENV: JSON.stringify(process.env.APP_ENV)
      }
    }),
    /** 在编译出现错误时，使用 NoEmitOnErrorsPlugin 来跳过输出阶段。
     * 这样可以确保输出资源不会包含错误。对于所有资源，统计资料(stat)的 emitted 标识都是 false */
    new webpack.NoEmitOnErrorsPlugin(),
    /** 热更新,devServer.hot代替 */
    //new webpack.HotModuleReplacementPlugin(),
    /** https://github.com/ampedandwired/html-webpack-plugin */
    /** 自动生成index.html文件 */
    new HtmlWebpackPlugin({
      //publicPath如果不配置则使用webpackConfig.output.publicPath
      //publicPath: config.publicPath,
      filename: 'index.html',
      template: 'index.html',
      inject: true,
      favicon: 'static/favicon.ico'
    }),
  ]
});

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig);
});