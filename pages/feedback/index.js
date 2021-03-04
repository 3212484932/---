/**
 * 1. 点击 “+” 触发 tap 点击事件
 *    1. 调用小程序内置的 选择图片 api
 *    2. 获取图片的路径 数组
 *    3. 把图片的路径 存储到 data 变量中
 *    4. 页面就可以根据 图片数组 进行循环显示 自定义组件
 * 2. 删除对应的图片
 *    1. 首先给元素添加点击事件 并且传递 data-index值
 *    2. 在事件中获取 index 索引的值
 *    3. 再获取 图片数组
 *    4. 根据索引删除对应的图片  chooseImg,splice(index, 1)
 * 3. 点击提交按钮事件
 *    1. 获取文本域中的内容 类似于输入框的获取 在 标签上绑定 value 属性  在事件 bindinput 中传递 e 就可以获取
 *        1. data中定义变量 表示输入框的 内容
 *        2. 文本域绑定输入事件 事件触发的时候 把输入框的值 存入到变量中
 *    2. 对这些内容 校验合法值
 *    3. 验证通过 用户选择图片 上传专门的图片到服务器 返回图片的外网连接
 *        1. 遍历数组
 *        2. 挨个上传
 *        3. 自己再维护图片的数组 存放 图片上传后的外网连接
 *    4. 文本域和外网图片路径 一起提交到服务器 前端模拟 不会发送请求到服务器
 *    5. 清空当前页面
 *    6. 返回上一页
 *
 */

// pages/feedback/index.js
Page({
  data: {
    // 顶部商品分类的导航
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true,
      },
      {
        id: 1,
        value: "商品或商家投诉",
        isActive: false,
      },
    ],
    // 储存图片
    chooseImg: [],
    // 储存文本的输入内容
    valText: "",
  },
  // 外网的图片路径数组
  upLoadImages: [],

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
   * 点击 “+” 选择图片事件
   */
  handleChooseImg() {
    // 注意 在 微信内置的 api中 调用的this 与函数中的 this 不是听一个 this  需要在函数的一开始 声明一个 that = this 然后 使用that
    var that = this;
    // 1. 调用小程序内置的 api
    wx.chooseImage({
      // 做多上传的图片数量
      count: 9,
      // 所选图片的尺寸   原图  压缩图
      sizeType: ["original", "compressed"],
      // 选择图片的来源 从相册选图 拍照
      sourceType: ["album", "camera"],
      success(result) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = result.tempFilePaths;
        console.log(tempFilePaths);
        that.setData({
          chooseImg: [...that.data.chooseImg, ...tempFilePaths],
        });
      },
    });
  },

  /**
   * 点击 图片 删除 对应的 图片
   */
  handleRemoveImg(e) {
    // 1. 获取需要删除的索引
    const { index } = e.currentTarget.dataset;
    // 2. 获取data中的 图片数组
    const { chooseImg } = this.data;
    // 3. 删除元素
    chooseImg.splice(index, 1);
    // 4. 将删除后的数组重新渲染会data中
    this.setData({
      chooseImg,
    });
  },

  /**
   * 文本域的输入事件
   */
  handleTextInput(e) {
    // console.log(e);
    // 1. 将输入框中输入的值 赋值给 valText
    this.setData({
      valText: e.detail.value,
    });
  },

  /**
   * 提交按钮的点击事件
   */
  handleSubmitCon() {
    // 1. 获取文本中的内容
    const { valText, chooseImg } = this.data;
    // 2. 校验内容是否合法
    if (!valText.trim()) {
      // 不合法 弹窗提示
      wx.showToast({
        title: "输入内容不合法",
        mask: true,
      });
      return;
    }
    // 3. 准备上传图片到专门的服务器
    // 弹窗提示 上传中
    wx.showLoading({
      title: "正在上传中",
      mask: true,
    });

    // 判断是否只是提交了文本
    if (chooseImg.lengeh !== 0) {
      // 有图片内容
      chooseImg.forEach((v, i) => {
        wx.uploadFile({
          // 图片要上传到哪里
          url: "https://www.7000mi.com/tianlong/#histroy",
          // 被上传图片的路径
          filePath: v,
          // 上传图片的名称 后台来获取文件 file
          name: "file",

          formData: {},
          success: (result) => {
            console.log(result);
            // 字符串解析
            const { url } = JSON.parse(result.data).url;
            this.upLoadImages.push(url);
            console.log(this.upLoadImages);

            // 所有的图片都上传完成了以后才会触发事件 将数据提交到后台
            if (i === chooseImg.length - 1) {
              // 关闭提示框
              wx.hideLoading();
              // 返回上一个页面
              wx.navigateBack({
                delta: 1,
              });
              // 打印模拟上传
              console.log("把文本和图片提交到后台");
              // 提交成功 重置页面
              this.setData({
                valText: "",
                chooseImg: [],
              });
            }
          },
          fail: (err) => {
            console.log(err);
          },
        });
      });
    } else {
      // 只是提交了文本
      console.log("只是提交了文本");
      // 返回上一个页面  关闭提示框
      wx.hideLoading();
      wx.navigateBack({
        delta: 1,
      });
    }
  },
});
