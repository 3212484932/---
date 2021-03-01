// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    userinfo: {},
  },

  /**
   * 页面初始化数据函数
   */
  onShow() {
    const userinfo = wx.getStorageSync("userinfo");
    this.setData({
      userinfo,
    });
    // console.log(userinfo);
  },
});
