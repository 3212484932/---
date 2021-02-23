// 为了放置异步请求嵌套过多进入回调地狱问题 创建 request请求
export const request = (params) => {
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  });
};
