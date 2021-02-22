//Page Object
Page({
  data: {
    // 轮播图数据
    swiperList: [],
  },
  //options(Object)
  // 页面加载触发
  onLoad: function () {
    wx.request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
      success: (result) => {
        this.setData({
          swiperList: result.data.message,
        });
      },
    });
  },
  onReady: function () {},
  onShow: function () {},
  onHide: function () {},
  onUnload: function () {},
  onPullDownRefresh: function () {},
  onReachBottom: function () {},
  onShareAppMessage: function () {},
  onPageScroll: function () {},
  //item(index,pagePath,text)
  onTabItemTap: function (item) {},
});
