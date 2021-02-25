/**
 * 1. 发送请求 获取数据
 * 2. 点击轮播图 预览大图片
 *    1. 给轮播图绑定点击事件
 *    2. 调用小程序的 API previewImage
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
// pages/goods_detail/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail: {},
  },
  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
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
});
