/** 获取终端类型 */
function getTerminalType() {
  let userAgent = navigator.userAgent.toLowerCase();
  let terminalType;
  if (userAgent.indexOf('iphone') !== -1) {
    terminalType = 'iphone';
  } else if (userAgent.indexOf('android') !== -1) {
    terminalType = 'android';
  } else {
    terminalType = 'pc';
  }
  return terminalType;
}

export default {
  /** 获取终端类型 */
  getTerminalType: getTerminalType
};