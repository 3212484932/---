/**
 * 1. 调用小程序的内置 API 获取用户的地址 wx.chooseAddress
 * 2. 获取用户 对小程序 所授权 获取地址的 权限状态 scope
 *    1. 假设 用户获取的收货地址的提示框 确定 authSetting scope.address
 *       scope 值 true 直接调用 获取收货地址
 *    2. 假设 用户从来没有调用过 收货地址的 API
 *       scope为 undefined 直接调用 获取收货地址
 *    3. 假设用户 点击获取收货地址的提示框 取消
 *       scope 值 false
 *       1. 诱导用户自己打开授权设置页面 当用户重新给予 获取地址权限的时候
 *       2. 获取收货地址
 * 3. 页面加载完毕
 *    0 onLoad onShow
 *    1 获取本地存储中的地址数据
 *    2 把数据 设置为 data 中的一个变量
 *
 */

import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js";
Page({
  data: {
    address: {},
  },
  onShow() {
    // 1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 2. 给data 赋值
    this.setData({
      address,
    });
  },

  /**
   * 获取地址的处理事件函数
   */
  async handleChooseAddress() {
    // console.log("111");
    // 调用小程序默认的插件 获取地址
    // 1 获取 权限状态
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      // 2 判断 权限状态
      if (scopeAddress === false) {
        await openSetting();
      }
      // 4 调用获取收货地址的 api
      let address = await chooseAddress();
      // console.log(address);
      // 整理数据格式
      address.all =
        address.provinceName +
        " " +
        address.cityName +
        " " +
        address.countyName +
        " " +
        address.detailInfo;
      // 5. 存入缓存中

      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error);
    }

    // // 1. 获取权限状态
    // const res1 = await getSetting();
    // let scopeAddress = res1.authSetting["scope.address"];
    // // 2. 判断权限状态
    // if (scopeAddress === true || scopeAddress === undefined) {
    //   // 3. 调用获取收货地址 api
    //   const res2 = await chooseAddress();
    //   console.log(res2);
    // } else {
    //   // 4. 诱导用户打开授权页面
    //   await openSetting();
    //   // 5. 调用获取收货地址的 API
    //   const res2 = await chooseAddress();
    //   console.log(res2);
    // }
  },
});
