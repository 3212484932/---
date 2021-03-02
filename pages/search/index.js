// pages/search/index.js
/**
 * 1. 输入框绑定 值改变事件 input事件
 *    1. 获取到输入框的值
 *    2. 合法性判断
 *    3. 检验通过 把输入框的值发送给后台
 *    4. 返回的数据渲染到页面上
 * 2. 防抖的处理 （使用定时器） 防止抖动  节流
 *    1. 防抖 一般是输入框 防止重复输入 重复发送请求
 *    2. 节流 一般用于页面的下拉 上拉刷新
 *    3. 定义全局的定时器 id
 */
import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 保存搜索结果
    goods: [],
    // 控制取消按钮的显示与隐藏
    isFocus: false,
    // 输入框中的值
    inpValue: "",
  },
  timeId: -1,
  /**
   * 搜索框事件
   * 搜索框触发 触发这个事件
   */
  handleInput(e) {
    // 1. 获取输入框中的值
    let { value } = e.detail;

    // 2. 判断 value 是否合法
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false,
      });
      // value 不合法
      return;
    }
    this.setData({
      isFocus: true,
    });
    // 防抖处理
    clearTimeout(this.timeId);
    this.timeId = setTimeout(() => {
      // 3. 发送请求
      this.qsearch(value);
    }, 1000);
  },

  /**
   * 发送搜索请求函数
   */
  async qsearch(query) {
    const res = await request({ url: "/goods/qsearch", data: { query } });
    console.log(res);
    this.setData({
      goods: res,
    });
  },
  /**
   * 点击取消的处理事件
   */
  handleCancel() {
    this.setData({
      inpValue: "",
      isFocus: false,
      goods: [],
    });
  },
});
