/**
 * 1. 页面的加载事件
 *    1. 从缓存中获取购物车数据 渲染到页面中
 *       这些数据 checked = true
 * 2. 微信支付
 *    1. 满足微信支付账号
 *      1. 企业账号
 *      2. 企业账号的小程序后台中 必须给开发者 添加白名单
 * 3. 支付按钮
 *    1. 先判断缓存中有没有 token
 *    2. 没有跳转到授权页面 获取 token
 *    3. 有 token 直接 进行下一步
 *    4. 创建订单 获取订单的编号
 *    5. 已经完成了微信支付
 *    6. 手动删除缓存中 已经被选中的商品
 *    7. 删除后的购物车数据 再填充回缓存
 *    8. 在跳转页面
 *
 */

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment,
} from "../../utils/asyncWx.js";
import { request } from "../../request/index.js";
import { randomString } from "../../utils/randomString.js";
Page({
  data: {
    // 地址
    address: {},
    // 购物车商品信息
    cart: [],
    // 商品总价
    allPrice: 0,
    // 商品总数
    allNum: 0,
  },
  onShow() {
    // 1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 2. 获取缓存中的购物车商品信息
    let cart = wx.getStorageSync("cart") || [];

    // 3. 过滤购物车数组  当 checked = false 过滤掉
    cart = cart.filter((v) => v.checked);
    this.setData({
      address,
    });

    let allPrice = 0;
    let allNum = 0;
    cart.forEach((v) => {
      allPrice += v.num * v.goods_price;
      allNum += v.num;
    });
    this.setData({
      address,
      cart,
      allPrice,
      allNum,
    });
  },

  /**
   * 点击支付按钮的事件函数
   */

  async handleOrderPay() {
    // console.log("11");
    try {
      const token = wx.getStorageSync("token");
      // 1. 判断是否有 token
      if (!token) {
        wx.navigateTo({
          url: "/pages/auth/index",
        });
        return;
      }
      // console.log("已经存在 token");
      // 2. 准备请求头参数
      // const header = { Authorization: token };
      // 商品总价格
      const order_price = this.data.allPrice;
      // 商品的收货地址
      const consignee_addr = this.data.address;
      // 商品数组
      const cart = this.data.cart;
      let goods = [];
      // 遍历商品数组
      cart.forEach((v) =>
        goods.push({
          goods_id: v.goods_id,
          goods_number: v.num,
          goods_price: v.goods_price,
        })
      );
      // 3. 准备请求参数
      const orderParams = { order_price, consignee_addr, goods };
      // 4. 发送请求 获取订单
      const res = await request({
        url: "/my/orders/create",
        method: "POST",
        data: orderParams,
      });

      console.log(
        res + " 获取订单信息请求 因为微信的缘故 使用伪造订单号 如下:"
      ); // 请求失败 使用 伪造的 订单编号

      // 调用方法 使用 伪造的 订单编号
      const order_number = randomString(24, "0123456789");
      console.log(order_number);
      // 5. 发起 预支付接口
      const pay = await request({
        url: "/my/orders/req_unifiedorder",
        method: "POST",
        data: order_number,
      });
      console.log(pay + "报错属于正常 因为 没有企业微信");
      // 发起微信支付

      // const resPay = await requestPayment(pay);
      // console.log(resPay);

      // 6. 查询后台的接口数据
      const res1 = await request({
        url: "/my/orders/chkOrder",
        method: "POST",
        data: order_number,
      });
      console.log(res1);
      // 7. 提示支付成功的消息
      if (res1 === undefined) {
        await showToast({ title: "支付成功" });
      }
      // 8. 手动删除缓存中已经支付的商品
      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter((v) => !v.checked);
      wx.setStorageSync("cart", newCart);

      // 9. 跳转到订单页面
      wx.navigateTo({
        url: "/pages/order/index",
      });
    } catch (error) {
      console.log(error);
      await showToast({ title: "支付失败" });
    }
  },
});
