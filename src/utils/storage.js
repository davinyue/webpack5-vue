/** 设置cookie，expires为有效秒，当传入 0 时为浏览器缺省的时间限制 */
const setCookie = (name, value, expires = 0, domain, path = '/') => {
  if (value instanceof Object) {
    value = JSON.stringify(value);
  }
  if (name === '') {
    return;
  }
  const exp = new Date();
  const theTime = exp.getTime() + (expires * 1000);
  exp.setTime(theTime);
  let cookie = `${name}=${value};expires=${exp.toGMTString()};path=${path}`;
  if (domain) {
    cookie = `${cookie};domain=${domain}`;
  }
  document.cookie = cookie;
};

/** 根据 cookie 名取值 */
const getCookie = (name) => {
  if (document.cookie !== '') {
    const thisCookie = document.cookie.split('; ');
    for (let i = 0; i < thisCookie.length; i++)
      if (name === thisCookie[i].split('=')[0]) {
        let result = thisCookie[i].split('=')[1];
        try {
          result = JSON.parse(result);
        } catch (e) {
          result = null;
        }
        return result;
      }
  }
  return null;
};

/** 删除cookie */
const removeCookie = (name, domain) => setCookie(name, '', -10, domain);

/** 保存变量到window.sessionStorage或者window.localStorage
 * @param persistence 是否持久化
 */
const setAttributeToStorage = (name, value, persistence = false) => {
  value = JSON.stringify(value);
  let storage = window.sessionStorage;
  if (persistence) {
    storage = window.localStorage;
  }
  storage.setItem(name, value);
};

/** 从Storage获取变量 */
const getAttributeFromStorage = (name, persistence = false) => {
  let storage = window.sessionStorage;
  if (persistence) {
    storage = window.localStorage;
  }
  let result = storage.getItem(name);
  try {
    result = JSON.parse(result);
  } catch (e) {
    result = null;
  }
  return result;
};

/** 从Storage删除变量 */
const removeAttributeFromStorage = (name, persistence = false) => {
  let storage = window.sessionStorage;
  if (persistence) {
    storage = window.localStorage;
  }
  storage.removeItem(name);
};

export default {
  /** 设置cookie，expires为有效分钟，当传入 0 时为浏览器缺省的时间限制 */
  setCookie: setCookie,
  /** 根据 cookie 名取值 */
  getCookie: getCookie,
  /** 删除cookie */
  removeCookie: removeCookie,
  /** 保存变量到window.sessionStorage或者window.localStorage
   * @param persistence — 是否持久化 */
  setAttributeToStorage: setAttributeToStorage,
  /** 从Storage获取变量 */
  getAttributeFromStorage: getAttributeFromStorage,
  /** 从Storage删除变量 */
  removeAttributeFromStorage: removeAttributeFromStorage
};
