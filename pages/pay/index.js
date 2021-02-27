/**
 * 1. 页面的加载事件
 *    1. 从缓存中获取购物车数据 渲染到页面中
 *       这些数据 checked = true
 * 2. 微信支付
 *    1. 满足微信支付账号
 *      1. 企业账号
 *      2. 企业账号的小程序后台中 必须给开发者 添加白名单
 *
 */

import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
} from "../../utils/asyncWx.js";
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
   * 设置购物车的状态
   */
  setCart(cart) {
    // 计算全选
    //  1. every 数组方法 会遍历 会接受一个回调函数 那么 每一个回调函数 都会返回一个true 那么 every方法 返回的值为 true
    //   只要有一个回调函数返回false 那么不再执行循环 直接返回false
    //   注意：空数组调用 every 返回值是 true
    //   注意： 在这里 使用 every方法 后使用 forEach 方法 浪费内存的处理 简化操作 使用 forEach方法
    // const allChecked = cart.length ? cart.every((v) => v.checked) : false;
    // 使用forEach方法循环数组 拿到 数组中的 checked值 当 为 true 加入商品总价  商品总数 +1
    // 6. 重新计算商品价格数量
    let allPrice = 0;
    let allNum = 0;
    let allChecked = true;
    cart.forEach((v) => {
      if (v.checked) {
        allPrice += v.num * v.goods_price;
        allNum += v.num;
      } else {
        allChecked = false;
      }
    });
    // 但是 当 cart为 空数组的时候 allChecked 又会变成 true
    // 判断 allchecked
    allChecked = cart.length != 0 ? allChecked : false;
    this.setData({
      cart,
      allPrice,
      allNum,
      allChecked,
    });
    wx.setStorageSync("cart", cart);
  },
});
