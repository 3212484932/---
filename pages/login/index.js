// pages/login/index.js
Page({
  // 点击登录 获取用户信息 事件处理函数
  handleGetUserInfo(e) {
    // console.log(e);
    const { userInfo } = e.detail;
    // 保存到本地存储中
    wx.setStorageSync("userinfo", userInfo);
    // 跳转回上一页
    wx.navigateBack({
      delta: 1,
    });
  },
});
