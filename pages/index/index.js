// 引入用来发送请求的方法 一定要把路径补齐
import { request } from "../../request/index.js";
//Page Object
Page({
  data: {
    // 轮播图数据
    swiperList: [],
    // 页面导航数据
    cateList: [],
    // 楼层数据
    floorList: [],
  },
  //options(Object)
  // 页面加载触发
  onLoad: function () {
    // 1. 异步请求获取轮播图数据， 优化手段可以通过 e
    // wx.request({
    //   url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
    //   success: (result) => {
    //     this.setData({
    //       swiperList: result.data.message,
    //     });
    //   },
    // });

    // 调用获取轮播图的事件方法函数
    this.getSwiperList();
    // 调用获取导航的事件处理函数
    this.getCateList();
    // 调用获取楼层事件方法函数
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata",
    }).then((result) => {
      this.setData({
        swiperList: result.data.message,
      });
    });
  },

  // 获取 分类导航数据
  getCateList() {
    request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/catitems",
    }).then((result) => {
      this.setData({
        cateList: result.data.message,
      });
    });
  },

  // 获取 楼层页面数据
  getFloorList() {
    request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/home/floordata",
    }).then((result) => {
      this.setData({
        floorList: result.data.message,
      });
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
