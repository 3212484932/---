import { request } from "../../request/index.js";
import regeneratorRuntime from "../../lib/runtime/runtime.js";
import { login } from "../../utils/asyncWx.js";
import { randomString } from "../../utils/randomString.js";
// pages/auth/index.js
Page({
  /**
   * 获取用户授权事件处理函数
   */
  async handleGetUserInfo(e) {
    // console.log(e);
    try {
      // 1. 获取用户信息
      const { encryptedData, iv, rawData, signature } = e.detail;
      // 2. 获取小程序登录成功后的 code
      const { code } = await login();
      const loginParams = { encryptedData, iv, rawData, signature, code };
      // console.log(code);
      // 3. 发送请求 获取用户的 token
      const res = await request({
        url: "/users/wxlogin",
        data: loginParams,
        method: "POST",
      });
      console.log(
        res + "获取用户 token的请求 由于微信的缘故 使用伪造的用户 token 如下:"
      );
      // 伪造 token
      const token = randomString(
        32,
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
      );
      // console.log(token);
      // 4. 把token保存在本地缓存中
      wx.setStorageSync("token", token);
      // 5. 跳转回上一页 (1) 表示跳转回上一个页面
      wx.navigateBack({
        delta: 1,
      });
    } catch (error) {
      console.log(error);
    }
  },
});
