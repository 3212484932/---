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
 * 5. 页面加载完成 获取缓存中的购物车数据
 *    1 获取本地存储中的数据
 *    2 将数据添加到 AppData 中
 * 6. 计算全选属性  使用every 方法
 *    1 使用 every方法循环遍历每一个数组 拿到 每一个数组的 checked 如果都为 true  则 allChecked 为true 否则 为 false
 *    注：细节处理   当cart数组为空的时候 every方法会默认返回true 处理方法： 需要在cart.every()方法前添加判断
 *        cart.length ? cart.every((v) => v.checked) : false;
 * 7. 计算购物车的总价格 以及商品的总数量
 *    当 cart 的 checked 为 true   allPrice += 商品的价格 * 商品数量
 *    商品的总数量 +1 操作
 *    将最后的 数组 传递给 AppData中
 * 8. 商品的选中
 *    1. 绑定change事件
 *    2. 获取到被修改的商品对象 id
 *    3. 商品对象的选中状态取反
 *    4. 重新填充回data的缓存中
 *    5. 重新计算 总价格 总数量
 */

import { getSetting, chooseAddress, openSetting } from "../../utils/asyncWx.js";
Page({
  data: {
    // 地址
    address: {},
    // 购物车商品信息
    cart: [],
    // 全选按钮
    allChecked: false,
    // 商品总价
    allPrice: 0,
    // 商品总数
    allNum: 0,
  },
  onShow() {
    // 1. 获取缓存中的收货地址信息
    const address = wx.getStorageSync("address");
    // 2. 获取缓存中的购物车商品信息
    const cart = wx.getStorageSync("cart") || [];

    this.setData({
      address,
    });
    this.setCart(cart);

    // 业务处理
    // let allPrice = 0;
    // let allNum = 0;
    // let allChecked = true;
    // cart.forEach((v) => {
    //   if (v.checked) {
    //     allPrice += v.num * v.goods_price;
    //     allNum += v.num;
    //   } else {
    //     allChecked = false;
    //   }
    // });
    // // 但是 当 cart为 空数组的时候 allChecked 又会变成 true
    // // 判断 allchecked
    // allChecked = cart.length != 0 ? allChecked : false;
    // // 2. 给data 赋值
    // this.setData({
    //   address,
    //   cart,
    //   allChecked,
    //   allPrice,
    //   allNum,
    // });
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

  /**
   * 处理复选框改变的事件
   */
  handleItemChange(e) {
    // 1. 获取商品的 id
    // console.log(e);
    const goods_id = e.currentTarget.dataset.id;
    // console.log(index);
    // 2. 获取购物车的数组
    let { cart } = this.data;
    // 3. 找到修改了的商品对象
    const index = cart.findIndex((v) => v.goods_id === goods_id);
    // 4. 选中状态取反
    cart[index].checked = !cart[index].checked;
    // 5. 将数据重新设置回 AppData数组中
    // 触发setCart 事件 处理下面的操作
    this.setCart(cart);
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
