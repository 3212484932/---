// 为了放置异步请求嵌套过多进入回调地狱问题 创建 request请求
let ajaxTime = 0;
export const request = (params) => {
  // 判断 url 中是否携带 /my/   如果有 请求的是私有路径 带上header token
  let header = { ...params.header };
  if (params.url.includes("/my/")) {
    // 拼接 header 带上 token
    header["Authorization"] = wx.getStorageSync("token");
  }
  // 显示加载中效果
  ajaxTime++;
  wx.showLoading({
    title: "加载中",
    mask: true,
  });
  const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      // 请求头 传递 token
      header: header,
      url: baseUrl + params.url,
      success: (result) => {
        resolve(result.data.message);
      },
      fail: (err) => {
        reject(err);
      },
      complete: () => {
        ajaxTime--;
        if (ajaxTime === 0) {
          wx.hideLoading();
        }
      },
    });
  });
};
