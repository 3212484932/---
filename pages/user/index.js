// pages/user/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 用户信息
    userinfo: {},
    // 收藏的数量
    collectNum: 0,
  },

  /**
   * 页面初始化数据函数
   */
  onShow() {
    const userinfo = wx.getStorageSync("userinfo");
    const collect = wx.getStorageSync("collect");
    this.setData({
      userinfo,
      collectNum: collect.length,
    });
    // console.log(userinfo);
  },
});
