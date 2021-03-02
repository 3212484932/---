// pages/collect/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    tabs: [
      {
        id: 0,
        value: "商品收藏",
        isActive: true,
      },
      {
        id: 1,
        value: "品牌收藏",
        isActive: false,
      },
      {
        id: 2,
        value: "店铺收藏",
        isActive: false,
      },
      {
        id: 3,
        value: "浏览足迹",
        isActive: false,
      },
    ],
    collect: [],
  },

  /**
   * onshow 事件
   */
  onShow() {
    const collect = wx.getStorageSync("collect");
    this.setData({
      collect,
    });
  },

  /**
   * 自定义事件
   * 标题点击事件将子组件传递过来
   */
  handleTabsItemChange(e) {
    // console.log(e);
    // 1. 获取被点击的标题索引
    const { index } = e.detail;
    // 2. 修改源数组
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? (v.isActive = true) : (v.isActive = false);
    });
    // 3. 将修改后的赋值给原来的data中
    this.setData({
      tabs,
    });
  },
});
