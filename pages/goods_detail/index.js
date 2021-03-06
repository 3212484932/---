/**
 * 1. 发送请求 获取数据
 * 2. 点击轮播图 预览大图片
 *    1. 给轮播图绑定点击事件
 *    2. 调用小程序的 API previewImage
 * 3. 点击加入购物车
 *    1. 先绑定点击事件
 *    2. 获取缓存中的购物车数据
 *    3. 先判断当前商品是否存在购物车
 *    4. 已经存在 修改商品数据 执行购物车数量++ 重新把购物车的数组 填充回缓存中
 *    5. 不存在于购物车数组中，直接给购物车的数组添加一个新元素 带上购物车的属性 num 重新把购物车的数组 填充回缓存中
 *    6. 弹窗提示
 * 4. 商品的收藏
 *    1. 页面 onShow的时候 加载缓冲中的商品收藏的数据
 *    2. 判断当前的商品是不是被收藏
 *        是 改变页面的图标
 *        不是 添加 isCollect
 *    3. 点击商品收藏按钮
 *      1. 判断该商品是否存在缓存数组中
 *      2. 已经存在 把该商品删除
 *      3. 没有存在 把商品添加到收藏数组中 存入缓存中即可
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
// pages/goods_detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 商品的 详细内容
    goodsDetail: {},
    // 商品收藏
    isCollect: false,
  },
  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages();
    let currentPages = pages[pages.length - 1];
    let options = currentPages.options;

    // console.log(options);
    const { goods_id } = options;
    console.log(goods_id);
    this.getGoodsDetail(goods_id);
  },
  // 发送请求 获取详情页面的参数
  async getGoodsDetail(goods_id) {
    const res = await request({
      url: "/goods/detail",
      data: { goods_id },
    });
    console.log(res);
    this.GoodsInfo = res;
    // 1. 获取缓存中的商品收藏的数组
    let collect = wx.getStorageSync("collect") || [];
    // 2. 判断当前商品是否被收藏
    let isCollect = collect.some((v) => v.goods_id === this.GoodsInfo.goods_id);
    console.log(isCollect);
    // 将请求到的数据保存
    this.setData({
      goodsDetail: {
        goods_name: res.goods_name,
        goods_price: res.goods_price,
        // 强制改变图片的格式
        // iphone 手机不识别 webp图片格式
        // 最好的方法就是找到后台，让他进行修改
        // 临时自己改 确保后台的存在  1.webp => 1.jpg
        goods_introduce: res.goods_introduce.replace(/\.webp/g, ".jpg"),
        goods_name: res.goods_name,
        pics: res.pics,
      },
      isCollect,
    });
  },

  // 处理预览图片的请求
  handlePreviewImage(e) {
    const urls = this.GoodsInfo.pics.map((v) => v.pics_mid);
    // console.log("预览");
    // 传递过来的图片的url
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current, // 当前显示图片的http链接
      urls, // 需要预览的图片http链接列表
    });
  },
  // 添加购物车事件处理函数
  handleCartAdd() {
    // console.log("购物车");
    //  *    2. 获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //  *    3. 先判断当前商品是否存在购物车
    let index = cart.findIndex((v) => v.goods_id === this.GoodsInfo.goods_id);
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodsInfo.num = 1;
      // 给GoodsInfo 添加 checked属性 表示选中复选框
      this.GoodsInfo.checked = true;
      cart.push(this.GoodsInfo);
    } else {
      // 存在 商品数量++
      cart[index].num++;
    }

    // 把购物车重新添加回缓存中
    wx.setStorageSync("cart", cart);
    // 弹窗提示
    wx.showToast({
      title: "添加成功",
      // true 防止用户手抖疯狂点击
      mask: true,
    });

    //  *    4. 已经存在 修改商品数据 执行购物车数量++ 重新把购物车的数组 填充回缓存中
    //  *    5. 不存在于购物车数组中，直接给购物车的数组添加一个新元素 带上购物车的属性 num 重新把购物车的数组 填充回缓存中
    //       6. 弹窗提示
  },
  // 收藏商品的处理事件
  handleCollect() {
    let isCollect = false;
    // 1. 获取收藏商品中的缓存数组
    let collect = wx.getStorageSync("collect") || [];
    // 2. 判断这个商品是否被收藏过
    let index = collect.findIndex(
      (v) => v.goods_id === this.GoodsInfo.goods_id
    );
    // 3. 当 index ！== -1 已经收藏过了
    if (index !== -1) {
      // 收藏过了 取消收藏 删除当前分类
      collect.splice(index, 1);
      // isCollect = false;
      // 取消收藏弹窗
      wx.showToast({
        title: "取消收藏",
        icon: "success",
        mask: true,
      });
    } else {
      // 没有收藏 加入收藏
      collect.push(this.GoodsInfo);
      isCollect = true;
      wx.showToast({
        title: "收藏成功",
        icon: "success",
        mask: true,
      });
    }
    // 4. 把数组存入缓存中
    wx.setStorageSync("collect", collect);
    // 修改data中的属性 isCollect
    this.setData({
      isCollect,
    });
  },
});
