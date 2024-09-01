import request from "@/api/request"

/**
 * @name 文件上传模块
 */
// 图片上传
export const uploadImg = (params: FormData) => {
  return request({
    url: "/file/upload/video",
    method: "post",
    params,
  });
};

// 视频上传
export const uploadVideo = (params: FormData) => {
  return request({
    url: "/file/upload/video",
    method: "post",
    params,
  });
};
