// 为了放置异步请求嵌套过多进入回调地狱问题 创建 request请求
let ajaxTime = 0;
export const request = (params) => {
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
