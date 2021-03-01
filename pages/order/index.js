/**
 * 1. 页面被打开的时候
 *    0. onShow 不同于 onLoad 不能在形参上接收 options
 *    1. 判断缓存中是否有token
 *      没有 就跳转到授权页面
 *      有 继续向下执行
 *    2. 获取 url 上的 type 参数
 *    3. 根据 type 去发送请求获取订单数据
 *    4. 渲染页面
 * 2. 点击不同的标题，重新发送请求获取和渲染数据
 */

import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
// pages/order/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: [
      {
        order_id: 428,
        user_id: 23,
        order_number: "HMDD20190802000000000428",
        order_price: 13999,
        order_pay: "0",
        is_send: "否",
        trade_no: "",
        order_fapiao_title: "个人",
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: "广东省广州市海珠区新港中路397号",
        pay_status: "1",
        create_time: 1564731518,
        update_time: 1564731518,
        order_detail: null,
        goods: [
          {
            id: 717,
            order_id: 428,
            goods_id: 43986,
            goods_price: 13999,
            goods_number: 1,
            goods_total_price: 13999,
            goods_name:
              "海信(Hisense)LED55MU9600X3DUC 55英寸 4K超高清量子点电视 ULED画质 VIDAA系统",
            goods_small_logo:
              "http://image5.suning.cn/uimg/b2c/newcatentries/0000000000-000000000160455569_1_400x400.jpg",
          },
        ],
        total_count: 1,
        total_price: 13999,
      },
    ],
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true,
      },
      {
        id: 1,
        value: "待付款",
        isActive: false,
      },
      {
        id: 2,
        value: "待收货",
        isActive: false,
      },
      {
        id: 3,
        value: "退款/退货",
        isActive: false,
      },
    ],
  },

  /**
   * 页面加载触发事件  onShow
   */
  onShow(options) {
    // 验证用户的 token
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: "/pages/auth/index",
      });
      return;
    }

    let pages = getCurrentPages();
    // console.log(pages);
    const currentPage = pages[pages.length - 1];
    console.log(currentPage.options);
    const { type } = currentPage.options;
    // 调用获取接口请求事件
    this.getOrders(type);
  },
  // 发送获取全部订单的请求参数
  async getOrders(type) {
    const res = await request({ url: "/my/orders/all", data: { type } });
    console.log(res + "由于微信问题 使用伪造数据");
  },
  // 自定义组件事件
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
