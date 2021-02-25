// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabs: {
      type: Array,
      value: [],
    },
  },

  /**
   * 组件的初始数据
   */
  data: {},

  /**
   * 组件的方法列表
   */
  methods: {
    handleItemTap(e) {
      // 获取当前的索引
      const { index } = e.currentTarget.dataset;
      // console.log(index);
      // 触发传递给父组件事件
      this.triggerEvent("tabsItemChange", { index });
    },
  },
});
