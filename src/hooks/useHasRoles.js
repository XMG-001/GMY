import useUserInfoStore from "@/store/modules/userInfo";

/**
 * @description 页面按钮权限
 * */
export const hasRoles = (roles) => {
  const userInfoStore = useUserInfoStore();

  // 确保 roles 是一个数组且非空
  if (!Array.isArray(roles) || roles.length === 0) {
    return false;
  }

  // 确保 userInfoStore.roles 存在且是一个数组
  const rolesList = userInfoStore.roles || [];
  if (!Array.isArray(rolesList)) {
    return false;
  }

  // 使用 some 来检查是否包含角色
  return roles.some(role => rolesList.includes(role));
}
