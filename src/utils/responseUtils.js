/** 请求结果是否成功
 * @param response 请求返回
 * @returns 返回true/false
 */
function isSuccess(response) {
  if (response.status >= 200 && response.status < 300 && response.data.code === 0) {
    return true;
  } else {
    return false;
  }
}

export default {
  /** 请求结果是否成功
 * @param response 请求返回
 * @returns 返回true/false
 */
  isSuccess: isSuccess
};