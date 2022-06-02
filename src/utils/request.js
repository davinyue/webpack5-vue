import axios from 'axios';
import qs from 'qs';

let axiosInstance = null;

/** 创建axios实例 */
function axiosCreateInstance() {
  const axiosInstance = axios.create({
    /** 将自动加在 `url` 前面，除非 `url` 是一个绝对 URL */
    //baseURL: serverPath,

    /** 设置超时时间 */
    timeout: 60 * 1000
    /** 设置请求头 */
    //headers: { 'Content-type': 'application/x-www-form-urlencoded' },
  });
  /** 不允许携带cookie请求 */
  axiosInstance.defaults.withCredentials = false;
  delete axiosInstance.defaults.headers.post['Content-Type'];
  delete axiosInstance.defaults.headers.patch['Content-Type'];
  delete axiosInstance.defaults.headers.put['Content-Type'];
  /** 请求拦截 */
  axiosInstance.interceptors.request.use(request => {
    /** 如果是文件上传，删除contentType,否则无法正常上传 */
    if (request.data && request.data instanceof FormData) {
      delete request.headers.common['Content-type'];
    }
    return request;
  }, error => {
    // eslint-disable-next-line no-undef
    return Promise.reject(error);
  });
  /** 响应拦截器 */
  axiosInstance.interceptors.response.use(function (response) {
    return response;
  }, function (error) {
    let response = error.response;
    if (!response) {
      response = {
        status: 503,
        statusText: error.message
      };
    }
    return response;
  });
  return axiosInstance;
}

/**
 * config.params是即将与请求一起发送的 URL 参数,必须是一个无格式对象(plain object)或 URLSearchParams 对象。
 * config.data是作为请求主体被发送的数据,只适用于这些请求方法 'PUT', 'POST', 和 'PATCH'
 */
function request(url, config) {
  if (!axiosInstance) {
    axiosInstance = axiosCreateInstance();
  }
  /** 请求头添加token */
  // let userInfo = storage.getUserInfo();
  // if (userInfo) {
  //   axiosInstance.defaults.headers.common['Content-type'] = userInfo.linuxprobeToken;
  // }
  return axiosInstance.request(url, config);
}

/** 执行get请求 */
function getRequest(url, params, config) {
  if (!axiosInstance) {
    axiosInstance = axiosCreateInstance();
  }
  axiosInstance.defaults.headers.common['Content-type'] = 'application/x-www-form-urlencoded;';
  let slipt = '?';
  if (url.indexOf('?') !== -1) {
    slipt = '&';
  }
  return axiosInstance.get(`${url}${slipt}${qs.stringify(params, { allowDots: true, arrayFormat: 'repeat', skipNulls: true })}`, config);
}

/** 执行delete请求 */
function deleteRequest(url, params, config) {
  if (!axiosInstance) {
    axiosInstance = axiosCreateInstance();
  }
  let slipt = '?';
  if (url.indexOf('?') !== -1) {
    slipt = '&';
  }
  axiosInstance.defaults.headers.common['Content-type'] = 'application/x-www-form-urlencoded;';
  return axiosInstance.delete(`${url}${slipt}${qs.stringify(params, { allowDots: true, arrayFormat: 'repeat', skipNulls: true })}`, config);
}

/** 执行put请求 */
function putRequest(url, data, config) {
  if (!axiosInstance) {
    axiosInstance = axiosCreateInstance();
  }
  if (!config) {
    config = {};
  }
  if (!config.headers) {
    config.headers = {};
  }
  if (!config.headers['Content-type']) {
    config.headers['Content-type'] = '';
  }
  axiosInstance.defaults.headers.common['Content-type'] = 'application/json;';
  return axiosInstance.put(url, data, config);
}

/** 执行post请求 */
function postRequest(url, data, config) {
  if (!axiosInstance) {
    axiosInstance = axiosCreateInstance();
  }
  if (!config) {
    config = {};
  }
  if (!config.headers) {
    config.headers = {};
  }
  if (!config.headers['Content-type']) {
    config.headers['Content-type'] = '';
  }
  axiosInstance.defaults.headers.common['Content-type'] = 'application/json;';
  return axiosInstance.post(url, data, config);
}

export default {
  request: request,
  getRequest: getRequest,
  putRequest: putRequest,
  deleteRequest: deleteRequest,
  postRequest: postRequest
};
