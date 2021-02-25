/**
 * 1. 用户上划页面的事件处理逻辑（用户上划页面 滚动条触底 开始加载下一页数据）
 *    1. 找到滚动条触底时事件 微信小程序官方开发文档中寻找
 *    2. 判断还有没有下一页数据
 *       1. 获取总页数  （只有总页数）
 *          总页数 = Math.ceil( 23 / 10 ) = 3
 *       2. 获取当前的页码
 *       3. 判断 当前页码 是否 大于等于 总页数
 *          表示 没有下一页数据
 *    3. 假如没有下一页数据 弹出一个提示
 *    4. 假如还有下一页数据 来加载下一页数据
 * 2. 下拉刷新以后 处理逻辑
 *    1. 触发下拉刷新事件 需要在页面 json 文件中开启一个配置项
 *       找到 下拉刷新的事件
 *    2. 重置数据的数组
 *    3. 重置页码 设置为 1
 *    4. 重新发送请求
 *    5. 数据请求回来 手动关闭等待效果
 *
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
// pages/goods_list/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 顶部商品分类的导航
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true,
      },
      {
        id: 1,
        value: "销量",
        isActive: false,
      },
      {
        id: 2,
        value: "价格",
        isActive: false,
      },
    ],
    // 商品列表数据
    goodsList: [],
  },

  // 接口需要使用的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10,
  },
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.QueryParams.cid = options.cid;

    // 调用获取商品列表的事件函数
    this.getDoodsList();
  },

  /**
   * 上拉触底事件
   */
  onReachBottom() {
    // 判断还有没有一下页数据了
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有下一页数据了
      // console.log("没有下一页数据了");
      wx.showToast({
        title: "没有更多了",
      });
    } else {
      // 有下一页数据
      // console.log("有下一页数据了");
      // 有数据 将页码 ++ 然后继续调用获取请求事件 渲染下一页数据
      this.QueryParams.pagenum++;
      this.getDoodsList();
    }
  },

  /**
   * 请求获取商品列表
   */
  async getDoodsList() {
    const res = await request({
      url: "/goods/search",
      data: this.QueryParams,
    });
    console.log(res);
    const total = res.total;
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    console.log(this.totalPages);

    this.setData({
      goodsList: [...this.data.goodsList, ...res.goods],
    });
    // 关闭下拉刷新窗口
    wx.stopPullDownRefresh();
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
  /**
   * 生命周期函数--下拉刷新事件
   */
  onPullDownRefresh() {
    // console.log("刷新了");
    // 业务逻辑
    // 1. 重置 goodsList 数组
    this.setData({
      goodsList: [],
    });
    // 2. 将页码重置为 1
    this.QueryParams.pagenum = 1;
    // 3. 调用函数重新发送请求
    this.getDoodsList();
  },
});
