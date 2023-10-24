"use strict";
const common_vendor = require("../../common/vendor.js");
require("../../utils/authorize.js");
const _sfc_main = {
  name: "customNav",
  props: {
    custom: {
      type: Boolean,
      default: () => false
    }
  },
  data() {
    return {
      //状态栏的高度（可以设置为顶部导航条的padding-top）
      statusBarHeight: common_vendor.index.getStorageSync("menuInfo").statusBarHeight,
      //状态栏的高度（可以设置为顶部导航条的padding-top）
      menuHeight: common_vendor.index.getStorageSync("menuInfo").menuHeight,
      surplusWidth: common_vendor.index.getStorageSync("menuInfo").surplusWidth,
      menuBorderRadius: common_vendor.index.getStorageSync("menuInfo").menuBorderRadius,
      menuRight: common_vendor.index.getStorageSync("menuInfo").menuRight,
      menuTop: common_vendor.index.getStorageSync("menuInfo").menuTop,
      contentTop: common_vendor.index.getStorageSync("menuInfo").contentTop
    };
  },
  methods: {
    // 返回上一路由
    handleNavigateBack() {
      if (this.custom) {
        this.$emit("customBack");
      } else {
        common_vendor.index.navigateBack(1);
      }
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o((...args) => $options.handleNavigateBack && $options.handleNavigateBack(...args)),
    b: $data.surplusWidth,
    c: $data.statusBarHeight,
    d: $data.statusBarHeight
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-17b2be72"], ["__file", "/Users/heyuanpeng/个人项目/小项目/we-shop-app/compnnents/customNavBack/customNavBack.vue"]]);
wx.createComponent(Component);
