import storage from './storage';
function getUserInfo() {
  return storage.getAttributeFromStorage('userInfo', true);
}

function setUserInfo(userInfo) {
  storage.setAttributeToStorage('userInfo', userInfo, true);
}

function removeUserInfo() {
  storage.removeAttributeFromStorage('userInfo', true);
}

/** 判断用户是否已登录 */
function isAuthenticated() {
  let userInfo = getUserInfo();
  if (userInfo) {
    return true;
  } else {
    return false;
  }
}

/** 判断是否拥有权限 */
function hasPermission(permission) {
  if (!permission)
    return true;
  else {
    let userInfo = getUserInfo();
    if (!userInfo || !userInfo.permissions) {
      return false;
    } else {
      let permissions = userInfo.permissions;
      //如果传递进来的是数组
      if (permission instanceof Array) {
        for (let i = 0; i < permission.length; i++) {
          let permissiontemp = permission[i];
          for (let h = 0; h < permissions.length; h++) {
            if (permissiontemp === permissions[h]) {
              if (i === permission.length - 1) {
                return true;
              } else {
                break;
              }
            } else {
              if (h === permissions.length - 1) {
                return false;
              }
            }
          }
        }
      }
      //如果传递进来的是字符串
      else {
        for (let h = 0; h < permissions.length; h++) {
          if (permission === permissions[h]) {
            return true;
          } else {
            if (h === permissions.length - 1) {
              return false;
            }
          }
        }
      }
    }
  }
}

/** 判断是否拥有角色 */
function hasRole(role) {
  if (!role)
    return true;
  else {
    let userInfo = getUserInfo();
    if (!userInfo) {
      return false;
    } else {
      let roles = userInfo.user.roles;
      //如果传递进来的是数组
      if (role instanceof Array) {
        for (var i = 0; i < role.length; i++) {
          let roletemp = role[i];
          for (var h = 0; h < roles.length; h++) {
            if (roletemp === roles[h]) {
              if (i === role.length - 1) {
                return true;
              } else {
                break;
              }
            } else {
              if (h === roles.length - 1) {
                return false;
              }
            }
          }
        }
      }
      //如果传递进来的是字符串
      else {
        for (let h = 0; h < roles.length; h++) {
          if (role === roles[h]) {
            return true;
          } else {
            if (h === roles.length - 1) {
              return false;
            }
          }
        }
      }
    }
  }
}

export default {
  /** 获取用户信息 */
  getUserInfo: getUserInfo,
  /** 设置用户信息 */
  setUserInfo: setUserInfo,
  /** 移除用户信息 */
  removeUserInfo: removeUserInfo,
  /** 判断用户是否已登录 */
  isAuthenticated: isAuthenticated,
  /** 判断是否拥有权限 */
  hasPermission: hasPermission,
  /** 判断是否拥有角色 */
  hasRole: hasRole
};
