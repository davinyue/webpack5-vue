/** 权限枚举 */
export default {
  /** 项目组权限 */
  project: {
    /**
     * 新增项目
     */
    ADD: 'auth:project:add',
    /**
     * 删除项目
     */
    DELETE: 'auth:project:delete',
    /**
     * 查询项目
     */
    QUERY: 'auth:project:query',
    /**
     * 修改项目
     */
    EDIT: 'auth:project:edit',
    /**
     * 管理项目
     */
    MANAGE: 'auth:project:manage',
    /**
     * 获取项目详情
     */
    DETAIL: 'auth:project:detail',
  },
  /** 应用组权限 */
  application: {
    /**
     * 新增应用
     */
    ADD: 'auth:application:add',
    /**
     * 删除应用
     */
    DELETE: 'auth:application:delete',
    /**
     * 查询应用
     */
    QUERY: 'auth:application:query',
    /**
     * 修改应用
     */
    EDIT: 'auth:application:edit',
    /**
     * 获应用详情
     */
    DETAIL: 'auth:application:detail',
    /**
     * 重置应用Secret
     */
    RESET_SECRET: 'auth:application:resetSecret',
  },
  /** 机构组权限 */
  org: {
    /**
     * 新增机构
     */
    ADD: 'auth:org:add',
    /**
     * 删除机构
     */
    DELETE: 'auth:org:delete',
    /**
     * 查询机构
     */
    QUERY: 'auth:org:query',
    /**
     * 修改机构
     */
    EDIT: 'auth:org:edit',
    /**
     * 获机构详情
     */
    DETAIL: 'auth:org:detail',
    /** 新增机构用户 */
    ADD_USER: 'auth:org:addUser',
    /** 删除机构用户 */
    DELETE_USER: 'auth:org:deleteUser'
  },
  /** 角色组权限 */
  role: {
    /**
     * 新增角色
     */
    ADD: 'auth:role:add',
    /**
     * 删除角色
     */
    DELETE: 'auth:role:delete',
    /**
     * 查询角色
     */
    QUERY: 'auth:role:query',
    /**
     * 修改角色
     */
    EDIT: 'auth:role:edit',
    /**
     * 获角色详情
     */
    DETAIL: 'auth:role:detail',
    /** 更新角色所属机构 */
    EDIT_ORG: 'auth:role:editOrg'
  },
  /** 用户组权限 */
  user: {
    /**
     * 新增用户
     */
    ADD: 'auth:user:add',
    /**
     * 删除用户
     */
    DELETE: 'auth:user:delete',
    /**
     * 查询用户
     */
    QUERY: 'auth:user:query',
    /**
     * 修改用户
     */
    EDIT: 'auth:user:edit',
    /**
     * 获取用户详情
     */
    DETAIL: 'auth:user:detail',
  },
  /** `权限组`组权限 */
  pg: {
    /**
     * 新增权限组
     */
    ADD: 'auth:pg:add',
    /**
     * 删除权限组
     */
    DELETE: 'auth:pg:delete',
    /**
     * 查询权限组
     */
    QUERY: 'auth:pg:query',
    /**
     * 修改权限组
     */
    EDIT: 'auth:pg:edit',
    /**
     * 获取权限组详情
     */
    DETAIL: 'auth:pg:detail',
  },
  /** 权限组权限 */
  permission: {
    /**
     * 新增权限
     */
    ADD: 'auth:permission:add',
    /**
     * 删除权限
     */
    DELETE: 'auth:permission:delete',
    /**
     * 查询权限
     */
    QUERY: 'auth:permission:query',
    /**
     * 修改权限
     */
    EDIT: 'auth:permission:edit',
    /**
     * 获取权限详情
     */
    DETAIL: 'auth:permission:detail',
  }
};