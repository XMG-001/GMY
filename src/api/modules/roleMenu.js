import request from "@/api/request"

// [
//   {
//     roleId: "2",
//     menuId: "100",
//   },
//   {
//     roleId: "2",
//     menuId: "200",
//   },
// ];
export const saveRoleMenuFn = (data) => {
  return request({
    url: "/role/saveRoleMenu",
    method: "post",
    data,
  });
};
