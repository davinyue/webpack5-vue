'use strict'
const webpack = require('webpack');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

const path = require('path');

const isPro = process.env.NODE_ENV === 'production';
const isProName = isPro ? 'pro' : 'dev';
console.log("当前webpack配置环境:" + isProName);

const config = require('../config');
/** 当前配置 */
console.log("当前环境:" + process.env.APP_ENV);
console.log("当前配置:" + JSON.stringify(config));


/** 创建css/less/sass的loader
 * @param addPostcssLoader 添加postcss-loader
 * @param addResolveUrlLoader 添加resolve-url-loader
 * @param cssOrlessOrSass 指定loader类型, 入参为int, 枚举列表--> 0:css, 1:less, 2:sass
 */
function createStyleLoader(addPostcssLoader, addResolveUrlLoader, cssOrlessOrSass) {
  let use = [];
  use.push("vue-style-loader");
  if (isPro) {
    use.push({
      loader: MiniCssExtractPlugin.loader,
      options: {
        esModule: false,
      }
    });
  } 
  // else {
  //   use.push("style-loader");
  // }
  let importLoaders = 0;
  if (addPostcssLoader) {
    importLoaders++;
  }
  if (addResolveUrlLoader) {
    importLoaders++;
  }
  if (cssOrlessOrSass === 1 || cssOrlessOrSass == 2) {
    importLoaders++;
  }
  use.push({
    loader: "css-loader",
    options: {
      sourceMap: !isPro,
      importLoaders: importLoaders,
      import: true,
      url: {
        filter: (url, resourcePath) => {
          if (url.startsWith('data:')) {
            return false;
          }
          return true;
        }
      }
    }
  });
  if (addPostcssLoader) {
    //css-loader处理后由该loader添加不同css属性前缀, 兼容不同浏览器
    use.push({
      loader: 'postcss-loader',
      options: {
        sourceMap: !isPro,
        postcssOptions: {
          plugins: [
            [
              'postcss-preset-env'
            ],
          ],
        },
      },
    });
  }
  if (addResolveUrlLoader) {
    //解决url路径问题
    use.push({
      loader: require.resolve('resolve-url-loader'),
      options: {
        sourceMap: !isPro,
        silent: true
      }
    });
  }
  if (cssOrlessOrSass == 1) {
    use.push({
      loader: 'less-loader',
      options: {
        sourceMap: !isPro,
        lessOptions: {
          javascriptEnabled: true
        }
      }
    });
  } else if (cssOrlessOrSass == 2) {
    use.push({
      loader: 'sass-loader',
      options: {
        sourceMap: !isPro,
        lessOptions: {
          javascriptEnabled: true
        }
      }
    });
  }
  if (cssOrlessOrSass === 0) {
    return {
      test: /\.css$/,
      use: use,
      sideEffects: true
    };
  } else if (cssOrlessOrSass === 1) {
    return {
      test: /\.less$/,
      use: use,
      sideEffects: true,
      //javascriptEnabled:true
    };
  } else if (cssOrlessOrSass === 2) {
    return {
      test: /\.sass$/,
      use: use,
      sideEffects: true
    };
  }
}

module.exports = {
  context: path.resolve(__dirname, '../'),
  /** 入口文件 */
  entry: {
    index: path.resolve(__dirname, '../', './src/index.js')
  },
  /** 编译输出配置 */
  output: {
    /** 打包后的文件存放的地方 */
    path: path.resolve(__dirname, '../dist'),
    /** 打包后输出文件的文件名 */
    filename: '[name].js',
    /** 对于按需加载(on-demand-load)或加载外部资源(external resources)（如图片、文件等）来说，
     * output.publicPath 是很重要的选项。如果指定了一个错误的值，则在加载这些资源时会收到 404 错误 */
    publicPath: config.publicPath
  },
  /** 传递多个目标时使用共同的特性子集, webpack 将生成 web 平台的运行时代码，并且只使用 ES5 相关的特性 */
  target: ['web', 'es5'],
  /** 设置模块如何被解析 */
  resolve: {
    /** 尝试按顺序解析这些后缀名。如果有多个文件有相同的名字，但后缀名不同，
     * webpack 会解析列在数组首位的后缀的文件 并跳过其余的后缀
     * 能够使用户在引入模块时不带扩展 */
    extensions: [
      '.js', '.jsx', '.ts', '.tsx', 'css', '.json', '.vue', '...'
    ],
    /** 创建 import 或 require 的别名，来确保模块引入变得更简单。例如，一些位于 src/ 文件夹下的常用模块 */
    alias: {
      '@': path.resolve(__dirname, '../src'),
      'sysConfig': path.resolve(__dirname, '../config')
    },
    fallback: {
      dgram: false,
      fs: false,
      net: false,
      tls: false,
      child_process: false
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(js|jsx|ts|tsx)$/,
        loader: 'babel-loader',
        options: { cacheDirectory: true },
        exclude: /node_modules/
      }, {
        test: /\.(tsx|ts)?$/,
        loader: "ts-loader"
      },
      //添加css loader
      createStyleLoader(true, false, 0),
      //添加less loader
      createStyleLoader(false, false, 1),
      //添加sass loader
      //createStyleLoader(true, true, 2),
      {
        test: /\.(png|jpe?g|gif|svg|mp4|webm|ogg|mp3|wav|flac|aac|woff|woff2|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: path.posix.join('static', 'media/[name].[hash:7].[ext]'),
          esModule: false
        },
        type: 'javascript/auto'
      }
    ]
  },
  plugins: [
    new ESLintPlugin({
      /** 指定文件根目录，类型为字符串 */
      context: 'src',
      /** 启动自动修复特性，小心: 该选项会修改源文件 */
      fix: false,
      /** 指定需要检查的扩展名 */
      extensions: ['js'],
      /** 指定需要排除的文件及目录。必须是相对于 options.context 的相对路径 */
      exclude: ['node_modules']
    }),
    /** 观察之前编译的 所有模块 的变化，以改进增量构建的时间 */
    new webpack.AutomaticPrefetchPlugin(),
    /** copy custom static assets,把静态文件复制到指定的目录 */
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../static'),
          to: 'static'
        }
      ]
    }),
    new VueLoaderPlugin()
  ]
}
