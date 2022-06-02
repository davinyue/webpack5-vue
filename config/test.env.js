'use strict'
/** 测试环境 */
module.exports = {
  publicPath: '/',
  /** 基础路由 */
  baseRoute: '/',
  serverPath: 'http://127.0.0.1:8080',
  authServicePath: '',
  serverProxy: 'http://127.0.0.1:8080',
  /** 缓存服务基础访问路径 */
  cacheServiceBasePath: '',
  /** 文件上传代理 */
  uploadApiProxy: '/uploadApi',
  /** 文件下载地址 */
  fileDownloadUrl: 'http://127.0.0.1:8080/file/download'
}