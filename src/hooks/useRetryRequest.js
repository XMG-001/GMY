import { ref } from 'vue';

/**
 * 一个通用的 hook 函数，用于执行 Axios 请求并在没有结果的情况下重试
 * @param {Function} requestFunc - 执行请求的函数，它可以接受可选的 payload 参数
 * @param {Object} [params={}] - 请求参数或 payload，可以为空
 * @param {number} [retryCount=3] - 最大重试次数
 * @param {number} [delay=1000] - 每次重试的延迟（以毫秒为单位）
 * @returns {Object} - 包含请求状态和数据的响应
 */
export async function useRetryRequest(requestFunc, params = {}, retryCount = 3, delay = 1000) {
  const res = ref(null);
  const error = ref(null);
  const loading = ref(true);

  await (async () => {
    let attempt = 0;
    while (attempt < retryCount) {
      try {
        let response;

        if (Object.keys(params).length === 0) {
          response = await requestFunc();
        } else {
          response = await requestFunc(params);
        }

        if (response) {
          res.value = response;
          error.value = null;
          break;
        }
      } catch (err) {
        error.value = err;
      }

      attempt++;
      if (attempt < retryCount) {
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
    loading.value = false;
  })();

  return { res, error, loading };
}
