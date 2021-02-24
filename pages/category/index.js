import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime";

// pages/category/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenuList: [],
    // 右侧内容数据
    rightContent: [],
    // 当前激活页面的索引
    currentIndex: 0,
    // 当切换页面以后将页面距离顶部的位置重置为0
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 调用获取分类数据的事件函数
    // this.getCates();

    /**
     * 0 web 中的本地存储和 小程序中的本地存储的区别
     *   1 写代码的方式不一样
     *      web：localStorage.setItem("key","value") localStorage.getItem("key")
     * 小程序中： wx.setStorageSync("key","value"); wx.getStorageSync("key")
     *   2 存的时候 有没有做数据类型的转化
     *      web：不管存入的什么数据类型 最终都会小调用以下 toString(),把数据变成了字符串 再存进去
     *   小程序： 不存在 类型转化这种操作 存什么样的数据类型进去，获取的就是什么数据类型
     * 1 先判断一下本地储存中有没有旧数据
     *    { time:Data.now(),data:[...] }
     * 2 没有旧数据 直接发送新请求
     * 3 有旧的数据同时旧的数据也没有过去过期，就使用本地存储中的旧数据就行
     *
     */

    // 1. 获取本地存储中的数据 （小程序也是存在本地存储技术）
    const Cates = wx.getStorageSync("cates");
    // 判断
    if (!Cates) {
      // 不存在 发送数据请求
      this.getCates();
    } else {
      // 用旧的数据 定义过期的时间 10s 改为 5分钟
      if (Date.now() - Cates.time > 1000 * 10) {
        // 重新发起请求
        this.getCates();
      } else {
        // 使用旧的数据
        this.Cates = Cates.data;
        // 构造左侧大菜单数据
        let leftMenuList = this.Cates.map((v) => v.cat_name);

        // 构造右侧内容数据
        let rightContent = this.Cates[0].children;

        this.setData({
          leftMenuList,
          rightContent,
        });
      }
    }
  },
  // 接口的返回数据
  Cates: [],

  // 获取分类页面数据
  async getCates() {
    // request({
    //   url: "/categories",
    // }).then((res) => {
    //   console.log(res);
    //   this.Cates = res.data.message;

    //   // 把接口储存到本地
    //   wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    //   // 构造左侧大菜单数据
    //   let leftMenuList = this.Cates.map((v) => v.cat_name);

    //   // 构造右侧内容数据
    //   let rightContent = this.Cates[0].children;

    //   this.setData({
    //     leftMenuList,
    //     rightContent,
    //   });
    // });
    const res = await request({
      url: "/categories",
    });
    this.Cates = res;

    // 把接口储存到本地
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });
    // 构造左侧大菜单数据
    let leftMenuList = this.Cates.map((v) => v.cat_name);

    // 构造右侧内容数据
    let rightContent = this.Cates[0].children;

    this.setData({
      leftMenuList,
      rightContent,
    });
  },
  // 处理切换不同页面的事件
  handleItemTap(e) {
    // console.log(e);
    // 获取被点击标题身上的索引
    // 将索引赋值给 currentindex
    // 根据不同的商品来渲染 右侧的值
    const { index } = e.currentTarget.dataset;
    // 同时构造右侧页面的数据
    let rightContent = this.Cates[index].children;

    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0,
    });
  },
});
