import request from './request';
import { notification, message } from 'antd';
import sysConfig from 'sysConfig';
import ErrorNotification from '../components/ErrorNotification';
import session from './session';

function resultCheck(result) {
  result.then(async function (data) {
    let errorData;
    if (data.status < 200 || data.status > 299) {
      errorData = {
        errorcode: data.status,
        msg: data.statusText
      };
    } else if (data.data.code !== 0) {
      errorData = {
        errorcode: data.data.code,
        msg: data.data.msg
      };
    }
    if (errorData) {
      if (errorData.errorcode === 1203) {
        session.removeUserInfo();
        window.location.reload();
      }
      if (sysConfig.env === 'dev') {
        let description = null;
        notification.error({
          message: `错误代码:${errorData.errorcode}`,
          description: description,
          duration: null,
          className: 'error_notification'
        });
      } else {
        message.error(errorData.msg);
      }
    }
  });
}

/** 初始化请求时认证信息 */
function initRequestAuthInfo(config) {
  if (!config) {
    config = {};
  }
  if (!config.headers) {
    config.headers = {};
  }
  let userInfo = session.getUserInfo();
  if (userInfo) {
    config.headers.x_auth_token = userInfo.token;
  }
  return config;
}

/** 用户登出 */
async function logout(reload = true) {
  await sysRequest.deleteRequest(`${sysConfig.serverProxy}${sysConfig.authServicePath}/admin/userLogout/h5`);
  session.removeUserInfo();
  if (reload) {
    window.location.reload();
  }
}

let sysRequest = {
  /** 发送http请求 */
  httpRequest: request.request,
  getRequest: request.getRequest,
  putRequest: request.putRequest,
  postRequest: request.postRequest,
  deleteRequest: request.deleteRequest,
  logout: logout
};

// eslint-disable-next-line no-undef
sysRequest = new Proxy(sysRequest, {
  get: function (target, key) {
    let sourceFunc = target[key];
    if (key === 'httpRequest' || key === 'getRequest' || key === 'putRequest'
      || key === 'postRequest' || key === 'deleteRequest') {
      return async (url, params, config) => {
        if (!config) {
          config = {};
        }
        if (!config.noAuth) {
          config = initRequestAuthInfo(config);
        }
        let ret = sourceFunc(url, params, config);
        if (!config.noCheckResult) {
          resultCheck(ret);
        }
        return ret;
      };
    } else {
      return sourceFunc;
    }
  }
});

export default sysRequest;